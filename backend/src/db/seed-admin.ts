import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { auth } from '../auth';

const pool = mysql.createPool(process.env.DATABASE_URL!);
const db = drizzle(pool, { mode: 'default', schema });

async function seedAdmin() {
  console.log('Setting up admin user via better-auth API...');

  const username = 'admin@mandalotim.id';
  const password = 'Manoke2004';
  const adminName = 'Super Admin';

  try {
    // Check if admin already exists
    const existing = await db.select().from(schema.users).where(eq(schema.users.email, username));
    
    if (existing.length > 0) {
      console.log(`Admin user "${username}" found. Deleting old account to re-create with correct hash...`);
      const userId = existing[0].id;
      
      // Delete related records first (foreign keys)
      try { await db.delete(schema.session).where(eq(schema.session.userId, userId)); } catch(e) {}
      try { await db.delete(schema.account).where(eq(schema.account.userId, userId)); } catch(e) {}
      await db.delete(schema.users).where(eq(schema.users.id, userId));
      console.log('Old admin account deleted.');
    }

    // Use better-auth's own signUp API to create the user
    // This ensures password is hashed exactly the way better-auth expects
    const response = await auth.api.signUpEmail({
      body: {
        email: username,
        password: password,
        name: adminName,
      },
    });

    if (!response || !response.user) {
      console.error('Failed to create admin user via better-auth API');
      await pool.end();
      return;
    }

    // Update role to admin
    await db.update(schema.users)
      .set({ role: 'admin' })
      .where(eq(schema.users.id, response.user.id));

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
