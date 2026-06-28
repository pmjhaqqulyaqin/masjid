const mysql = require('mysql2/promise');

async function fix() {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'masjid_db',
      password: 'manoke2004#',
      database: 'masjid_db'
    });
    
    console.log("Koneksi berhasil. Mengubah struktur tabel...");
    
    await db.query('ALTER TABLE verification MODIFY COLUMN value TEXT');
    await db.query('ALTER TABLE account MODIFY COLUMN accessToken TEXT');
    await db.query('ALTER TABLE account MODIFY COLUMN refreshToken TEXT');
    await db.query('ALTER TABLE account MODIFY COLUMN idToken TEXT');
    await db.query('ALTER TABLE user MODIFY COLUMN image TEXT');
    
    console.log('✅ Database Berhasil Diperbaiki!');
    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal memperbaiki database:", error);
    process.exit(1);
  }
}

fix();
