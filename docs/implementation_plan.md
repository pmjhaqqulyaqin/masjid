# Masjid Haqqul Yaqin - Full-Stack Implementation Plan

Pondasi desain UI statis (Frontend Jamaah dan Backend Admin) telah rampung dan disimpan. Rencana implementasi ini akan menguraikan langkah-langkah transisi dari tahap desain menuju *engineering* fungsional penuh berdasarkan dokumen `PRD.md`.

Fokus utama adalah menyiapkan infrastruktur lokal (`docker-compose`), membangun *Backend API* dengan Express, Drizzle ORM, dan PostgreSQL, serta menginisialisasi *Frontend* React menggunakan Vite, TanStack Query, dan Better Auth Client.

> [!IMPORTANT]
> **User Review Required**
> Mohon baca dengan saksama rencana arsitektur ini. Jika disetujui, saya akan mengeksekusi langkah demi langkah secara sistematis untuk membangun kerangka aplikasi.

---

## Open Questions

> [!NOTE]
> 1. Apakah Anda ingin backend API dan frontend React diletakkan di dalam folder *monorepo* (misal: folder `backend` dan `frontend` di dalam root direktori saat ini), atau Anda lebih suka mereka dicampur (misal: root untuk backend, dan subfolder untuk frontend)? Pendekatan **monorepo (folder terpisah)** direkomendasikan.
> 2. Apakah ada port spesifik yang ingin dihindari untuk *Dev Server*? (Secara bawaan saya akan menggunakan Port `3000` untuk API dan `5173` untuk Frontend Vite).
> 3. Apakah *mockup* HTML yang sudah kita buat akan dipindahkan/diubah secara otomatis oleh saya ke dalam struktur komponen React (`.jsx`/`.tsx`), atau kita siapkan kerangkanya terlebih dahulu?

---

## Proposed Changes

### 1. Database & Environment Setup
Setup lingkungan *development* menggunakan Docker agar instansiasi database Postgres lebih mudah, stabil, dan terisolasi.

#### [NEW] `docker-compose.yml`
Menyediakan *container* PostgreSQL untuk *development*.
#### [NEW] `.env.example` & `.env`
Berisi kredensial *default* database, *secret key* Better Auth, serta konfigurasi port server.

---

### 2. Backend Initialization (Express + Drizzle + Better Auth)
Membangun struktur backend API yang kokoh dengan layer arsitektur *Controller*, *Service*, dan *Repository*.

#### [NEW] `backend/package.json`
Inisialisasi *project* Node.js dengan dependensi Express, Drizzle ORM, `pg` (Postgres client), CORS, `dotenv`, dan Better Auth.
#### [NEW] `backend/src/db/schema.ts`
Menerjemahkan skema *database* dari PRD (Users, Donations, Kajian, Finances, Services) menjadi Drizzle schema.
#### [NEW] `backend/src/db/index.ts`
Koneksi Drizzle ke PostgreSQL menggunakan `pg`.
#### [NEW] `backend/src/auth.ts`
Konfigurasi utama *Better Auth* dan ekspor *handler* untuk integrasi Express.
#### [NEW] `backend/src/app.ts` & `backend/src/server.ts`
Entry point untuk aplikasi Express, *middleware* CORS, dan koneksi ke rute.

---

### 3. Backend API Routes & Services
Sesuai rancangan *Controller -> Service -> Repository* di PRD.

#### [NEW] `backend/src/services/*.ts`
Kumpulan logika bisnis, seperti `DonationService.ts`, `KajianService.ts`, `FinanceService.ts`, dan `ServiceRequestService.ts`.
#### [NEW] `backend/src/routes/*.ts`
File *routing* Express yang menghubungkan HTTP *request* ke servis yang sesuai.

---

### 4. Frontend Initialization (React + Vite)
Membuat kerangka *client* modern untuk mengonversi HTML statis menjadi komponen interaktif.

#### [NEW] `frontend/package.json`
Inisialisasi via `npm create vite@latest` dengan React + TypeScript. Dependensi tambahan: `react-router-dom`, `@tanstack/react-query`, Tailwind CSS, dan *Better Auth Client*.
#### [NEW] `frontend/src/lib/auth-client.ts`
Menginisialisasi klien Better Auth untuk Frontend yang terhubung dengan URL API Backend.
#### [NEW] `frontend/src/lib/api/`
Folder berisi klien API *fetcher* modular (misal `kajian.ts`, `donations.ts`) untuk dipanggil dari UI.
#### [NEW] `frontend/src/hooks/`
Kumpulan *Custom Hooks* pembungkus TanStack Query seperti `useGetKajian()`, `useFinanceSummary()`, dll.

---

### 5. Frontend Router & Component Structure
Menyiapkan *Router* agar desain *multi-page* HTML kita dapat ditransisikan ke *Single Page Application* (SPA).

#### [NEW] `frontend/src/App.tsx` & `frontend/src/main.tsx`
*Wrapper* untuk `QueryClientProvider` dan konfigurasi *React Router*.
#### [NEW] `frontend/src/pages/`
Struktur kerangka dasar React komponen untuk halaman beranda, jamaah, dan *admin dashboard*. (Isi lengkapnya akan diintegrasikan dari HTML statis kita pada fase pengerjaan komponen).

---

## Verification Plan

### Automated Tests / Linting
- Menjalankan pengecekan TypeScript (`tsc --noEmit`) pada Frontend dan Backend.
- Memastikan `drizzle-kit generate` dan `push` (atau *migration*) berjalan lancar ke database Postgres di dalam Docker.

### Manual Verification
- Menjalankan perintah `docker compose up -d`.
- Mengakses Backend via `http://localhost:3000` (Ping test).
- Mengakses Frontend Vite Dev Server (`http://localhost:5173`) dan memvalidasi bahwa koneksi *TanStack Query* berhasil memanggil endpoint API dengan lancar.
- Validasi fungsionalitas dasar *Better Auth* (kemampuan mendaftar *user*).
