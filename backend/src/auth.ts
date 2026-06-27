import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { phoneNumber } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";
import 'dotenv/config';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification
    }
  }),
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        // Implementasi pengiriman OTP via WhatsApp Gateway
        // Contoh: panggil API ke provider WA (misal: Fonnte, WABlas)
        console.log(`\n=================================\nKODE OTP WHATSAPP UNTUK ${phoneNumber} : ${code}\n=================================\n`);
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => `${phoneNumber}@haqqulyaqin.local`,
        getTempName: (phoneNumber) => `Jamaah ${phoneNumber}`,
      }
    })
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }
  },
  trustedOrigins: [process.env.VITE_API_URL || 'http://localhost:5173']
});
