import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { randomBytes, scrypt } from 'crypto';

// Match better-auth's exact scrypt config from @better-auth/utils/password
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

const pool = mysql.createPool(process.env.DATABASE_URL!);
const db = drizzle(pool, { mode: 'default', schema });

async function seedAdmin() {
  console.log('Creating admin user...');

  const username = 'admin@mandalotim.id';
  const password = 'Manoke2004';
  const adminName = 'Super Admin';

  try {
    // Check if admin already exists
    const existing = await db.select().from(schema.users).where(eq(schema.users.email, username));
    if (existing.length > 0) {
      console.log(`Admin user "${username}" already exists. Updating role to admin...`);
      await db.update(schema.users).set({ role: 'admin' }).where(eq(schema.users.email, username));
      console.log('Admin role updated.');
      await pool.end();
      return;
    }

    const userId = uuidv4();
    const accountId = uuidv4();
    const now = new Date();

    // Create user
    await db.insert(schema.users).values({
      id: userId,
      name: adminName,
      email: username,
      emailVerified: true,
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    });

    // Create account with credential provider (better-auth stores password in account table)
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

    console.log('========================================');
    console.log('Admin user created successfully!');
    console.log(`Username : ${username}`);
    console.log(`Password : ${password}`);
    console.log(`Role     : admin`);
    console.log('========================================');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await pool.end();
  }
}

seedAdmin();
