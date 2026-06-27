import { pgTable, text, boolean, timestamp, serial, decimal, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phoneNumber: text('phone_number'),
  phoneNumberVerified: boolean('phoneNumberVerified').notNull().default(false),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  role: text('role').notNull().default('jamaah'), // 'jamaah', 'admin', 'staff'
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => users.id)
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => users.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt")
});

// 2. Donations / ZIS
export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id), // Bisa null untuk hamba Allah (Anonim)
  donorName: text('donor_name'), // Untuk manual entry yang tidak punya user id
  type: text('type').notNull(), // 'infaq', 'zakat', 'wakaf'
  amount: decimal('amount').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'qris', 'transfer_bank'
  status: text('status').notNull().default('pending'), // 'pending', 'success', 'failed'
  createdAt: timestamp('created_at').defaultNow()
});

// 3. Kajian
export const kajian = pgTable('kajian', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  ustadzName: text('ustadz_name').notNull(),
  description: text('description'),
  scheduledAt: timestamp('scheduled_at').notNull(),
  liveStreamUrl: text('live_stream_url'), // Link YouTube/Zoom
  createdAt: timestamp('created_at').defaultNow()
});

// 4. Finances (Keuangan)
export const finances = pgTable('finances', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'income', 'expense'
  category: text('category').notNull(), // misal: 'operasional', 'pembangunan', 'infaq_jumat'
  amount: decimal('amount').notNull(),
  description: text('description'),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// 5. Services (Layanan Kepengurusan)
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  serviceType: text('service_type').notNull(), // 'mualaf', 'jenazah', 'nikah', 'aula'
  formData: jsonb('form_data').notNull(), // Data spesifik per layanan disimpan dinamis
  status: text('status').notNull().default('pending'), // 'pending', 'approved', 'rejected'
  createdAt: timestamp('created_at').defaultNow()
});

// 6. Ibadah (Jadwal Shalat & Petugas)
export const ibadah = pgTable('ibadah', {
  id: serial('id').primaryKey(),
  prayerType: text('prayer_type').notNull(), // 'shubuh', 'zhuhur', 'ashar', 'maghrib', 'isya', 'jumat'
  time: timestamp('time').notNull(),
  imamName: text('imam_name'),
  muadzinName: text('muadzin_name'),
  khatibName: text('khatib_name'), // Khusus untuk Jumat
  bilalName: text('bilal_name'), // Khusus untuk Jumat
  createdAt: timestamp('created_at').defaultNow()
});

// 7. Settings (General Key-Value config)
export const settings = pgTable('settings', {
  key: text('key').primaryKey(), // misal: 'mosque_name', 'map_coordinates', 'is_open_24h'
  value: text('value').notNull()
});

// 8. Facilities (Direktori Fasilitas)
export const facilities = pgTable('facilities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(), // Material symbol name
  description: text('description')
});
