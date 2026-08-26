import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL && process.env.BETTER_AUTH_URL.includes('masjid') ? process.env.BETTER_AUTH_URL : 'https://masjid.mandualotim.sch.id',
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification
    }
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || '', process.env.FRONTEND_URL || 'http://localhost:5173', 'http://127.0.0.1:5173', 'https://masjid.mandualotim.sch.id'].filter(Boolean)
});
