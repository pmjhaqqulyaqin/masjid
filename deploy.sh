#!/bin/bash

echo "🚀 Memulai Deployment Update Masjid Haqqul Yaqin..."

# Pastikan berada di direktori yang benar
cd /www/wwwroot/masjid.mandualotim.sch.id || exit

# 1. Menarik pembaruan dari GitHub
echo "📦 Mengambil update terbaru dari GitHub..."
git fetch
git reset --hard origin/main

# 2. Build Frontend
echo "🎨 Membangun ulang Frontend..."
cd frontend
echo "VITE_API_URL=https://masjid.mandualotim.sch.id/api" > .env
npm install
npm run build
cd ..

# 3. Build Backend & Push Database
echo "⚙️ Membangun ulang Backend dan Sinkronisasi Database..."
cd backend
npm install
npm run build
npm run db:push
cd ..

# 4. Memperbaiki izin file (untuk aaPanel)
echo "🔐 Memperbaiki izin file untuk aaPanel..."
chown -R www:www .

# 5. Restart PM2 (menggunakan nama pm2 yang telah dibuat)
echo "🔄 Merestart server PM2..."
# Akan merestart project di PM2 yang melayani file backend.
# Ganti 'masjid_backend' jika Anda memberikan nama berbeda di PM2 Manager aaPanel.
pm2 restart masjid_backend || pm2 restart all

echo "✅ Deployment Selesai! Web sudah terupdate."
