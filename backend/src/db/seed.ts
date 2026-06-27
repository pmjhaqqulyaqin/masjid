import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log('Seeding data...');

  try {
    // Seed Admin User
    const adminId = uuidv4();
    await db.insert(schema.users).values({
      id: adminId,
      name: 'Super Admin',
      email: 'admin@masjid.id',
      phoneNumber: '081234567890',
      emailVerified: true,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('User Admin created.');

    // Seed Donations
    await db.insert(schema.donations).values([
      { userId: adminId, type: 'infaq', amount: '500000', paymentMethod: 'qris', status: 'success' },
      { userId: null, type: 'infaq', amount: '100000', paymentMethod: 'transfer_bank', status: 'success' },
      { userId: adminId, type: 'zakat', amount: '2500000', paymentMethod: 'transfer_bank', status: 'pending' },
    ]);

    console.log('Donations created.');

    // Seed Kajian
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await db.insert(schema.kajian).values([
      {
        title: 'Kajian Tafsir Al-Baqarah',
        ustadzName: 'Ust. Dr. Khalid Basalamah',
        description: 'Tafsir ayat 1-10 surat Al-Baqarah.',
        scheduledAt: tomorrow,
      },
      {
        title: 'Fiqih Shalat',
        ustadzName: 'Ust. Adi Hidayat, Lc',
        description: 'Tata cara shalat sesuai sunnah.',
        scheduledAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
      }
    ]);

    console.log('Kajian created.');

    // Seed Finances
    await db.insert(schema.finances).values([
      { type: 'income', category: 'infaq_jumat', amount: '15000000', description: 'Infaq Jumat Pekan 1', date: new Date() },
      { type: 'expense', category: 'operasional', amount: '2000000', description: 'Listrik & Air Bulanan', date: new Date() },
    ]);

    console.log('Finances created.');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await pool.end();
  }
}

seed();
