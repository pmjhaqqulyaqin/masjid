import { mysqlTable, varchar, boolean, timestamp, int, decimal, json, text } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phoneNumber: varchar('phone_number', { length: 50 }),
  phoneNumberVerified: boolean('phoneNumberVerified').notNull().default(false),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  role: varchar('role', { length: 50 }).notNull().default('jamaah'), // 'jamaah', 'admin', 'staff'
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: varchar("ipAddress", { length: 255 }),
  userAgent: varchar("userAgent", { length: 255 }),
  userId: varchar("userId", { length: 255 }).notNull().references(() => users.id)
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  providerId: varchar("providerId", { length: 255 }).notNull(),
  userId: varchar("userId", { length: 255 }).notNull().references(() => users.id),
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

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt")
});

// 2. Donations / ZIS
export const donations = mysqlTable('donations', {
  id: int('id').autoincrement().primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id), // Bisa null untuk hamba Allah (Anonim)
  donorName: varchar('donor_name', { length: 255 }), // Untuk manual entry yang tidak punya user id
  type: varchar('type', { length: 50 }).notNull(), // 'infaq', 'zakat', 'wakaf'
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // 'qris', 'transfer_bank'
  status: varchar('status', { length: 50 }).notNull().default('pending'), // 'pending', 'success', 'failed'
  proofUrl: varchar('proof_url', { length: 255 }), // Untuk bukti transfer manual
  createdAt: timestamp('created_at').defaultNow()
});

// 3. Kajian
export const kajian = mysqlTable('kajian', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  ustadzName: varchar('ustadz_name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
  scheduledAt: timestamp('scheduled_at').notNull(),
  liveStreamUrl: varchar('live_stream_url', { length: 255 }), // Link YouTube/Zoom
  createdAt: timestamp('created_at').defaultNow()
});

// 4. Finances (Keuangan)
export const finances = mysqlTable('finances', {
  id: int('id').autoincrement().primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // 'income', 'expense'
  category: varchar('category', { length: 100 }).notNull(), // misal: 'operasional', 'pembangunan', 'infaq_jumat'
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  description: varchar('description', { length: 255 }),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// 5. Services (Layanan Kepengurusan)
export const services = mysqlTable('services', {
  id: int('id').autoincrement().primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id).notNull(),
  serviceType: varchar('service_type', { length: 100 }).notNull(), // 'mualaf', 'jenazah', 'nikah', 'aula'
  formData: json('form_data').notNull(), // Data spesifik per layanan disimpan dinamis
  status: varchar('status', { length: 50 }).notNull().default('pending'), // 'pending', 'approved', 'rejected'
  createdAt: timestamp('created_at').defaultNow()
});

// 6. Ibadah (Jadwal Shalat & Petugas)
export const ibadah = mysqlTable('ibadah', {
  id: int('id').autoincrement().primaryKey(),
  prayerType: varchar('prayer_type', { length: 50 }).notNull(), // 'shubuh', 'zhuhur', 'ashar', 'maghrib', 'isya', 'jumat'
  time: timestamp('time').notNull(),
  imamName: varchar('imam_name', { length: 255 }),
  muadzinName: varchar('muadzin_name', { length: 255 }),
  khatibName: varchar('khatib_name', { length: 255 }), // Khusus untuk Jumat
  bilalName: varchar('bilal_name', { length: 255 }), // Khusus untuk Jumat
  createdAt: timestamp('created_at').defaultNow()
});

// 7. Settings (General Key-Value config)
export const settings = mysqlTable('settings', {
  key: varchar('key', { length: 255 }).primaryKey(), // misal: 'mosque_name', 'map_coordinates', 'is_open_24h'
  value: varchar('value', { length: 1000 }).notNull()
});

// 8. Facilities (Direktori Fasilitas)
export const facilities = mysqlTable('facilities', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 50 }).notNull(), // Material symbol name
  description: varchar('description', { length: 1000 })
});

// 9. Articles (Tausiyah & Pengumuman)
export const articles = mysqlTable('articles', {
  id: int('id').autoincrement().primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // 'tausiyah', 'pengumuman'
  title: varchar('title', { length: 255 }).notNull(),
  content: varchar('content', { length: 5000 }).notNull(),
  author: varchar('author', { length: 255 }),
  imageUrl: varchar('image_url', { length: 255 }),
  publishedAt: timestamp('published_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow()
});
