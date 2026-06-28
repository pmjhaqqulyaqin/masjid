import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { phoneNumber } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";
import 'dotenv/config';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
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
        // Implementasi pengiriman OTP via Fonnte
        const token = process.env.FONNTE_TOKEN;
        if (!token) {
          console.warn(`[WARNING] FONNTE_TOKEN is not set in .env. OTP ${code} for ${phoneNumber} was not sent.`);
          console.log(`\n=================================\nKODE OTP WHATSAPP UNTUK ${phoneNumber} : ${code}\n=================================\n`);
          return;
        }

        try {
          const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              target: phoneNumber,
              message: `*SISTEM MASJID HAQQUL YAQIN*\n\nKode OTP Anda adalah: *${code}*\n\nMohon jangan berikan kode ini kepada siapapun.`
            })
          });

          const data = await response.json();
          if (!data.status) {
            console.error('[FONNTE ERROR]', data);
          } else {
            console.log(`[FONNTE SUCCESS] OTP sent to ${phoneNumber}`);
          }
        } catch (error) {
          console.error('[FONNTE EXCEPTION]', error);
        }
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
  trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://127.0.0.1:5173']
});
