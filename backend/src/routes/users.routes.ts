import { Router, Request, Response } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes, scrypt } from 'crypto';
import { auth } from '../auth';
import { fromNodeHeaders } from 'better-auth/node';

const router = Router();

// Match better-auth's exact scrypt config
const SCRYPT_CONFIG = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64
};

function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex');
    scrypt(
      password.normalize('NFKC'),
      salt,
      SCRYPT_CONFIG.dkLen,
      {
        N: SCRYPT_CONFIG.N,
        r: SCRYPT_CONFIG.r,
        p: SCRYPT_CONFIG.p,
        maxmem: 128 * SCRYPT_CONFIG.N * SCRYPT_CONFIG.r * 2
      },
      (err, key) => {
        if (err) reject(err);
        else resolve(`${salt}:${key.toString('hex')}`);
      }
    );
  });
}

// Middleware to check admin role
async function requireAdmin(req: Request, res: Response, next: Function) {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Check role in database
    const users = await db.select().from(schema.users).where(eq(schema.users.id, session.user.id));
    if (users.length === 0 || users[0].role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    (req as any).user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// GET /api/users - List all users
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      role: schema.users.role,
      createdAt: schema.users.createdAt,
    }).from(schema.users);
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/create - Create a new user (admin only)
router.post('/create', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { username, password, name, role } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Username, password, dan nama wajib diisi' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password minimal 8 karakter' });
    }

    // Check if username already exists
    const existing = await db.select().from(schema.users).where(eq(schema.users.email, username));
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username sudah digunakan' });
    }

    const userId = uuidv4();
    const accountId = uuidv4();
    const now = new Date();

    // Create user
    await db.insert(schema.users).values({
      id: userId,
      name: name,
      email: username,
      emailVerified: true,
      role: role || 'staff',
      createdAt: now,
      updatedAt: now,
    });

    // Create account with hashed password
    const hashedPassword = await hashPassword(password);
    await db.insert(schema.account).values({
      id: accountId,
      accountId: userId,
      providerId: 'credential',
      userId: userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({
      id: userId,
      name,
      username,
      role: role || 'staff',
      message: 'User berhasil dibuat'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/:id - Delete a user (admin only)
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // Prevent deleting yourself
    if (id === currentUser.id) {
      return res.status(400).json({ error: 'Tidak bisa menghapus akun sendiri' });
    }

    // Delete account entries first (foreign key)
    await db.delete(schema.account).where(eq(schema.account.userId, id));
    // Delete sessions
    await db.delete(schema.session).where(eq(schema.session.userId, id));
    // Delete user
    await db.delete(schema.users).where(eq(schema.users.id, id));

    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
