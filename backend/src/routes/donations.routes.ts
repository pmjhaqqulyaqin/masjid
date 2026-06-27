import { Router } from 'express';
import { db } from '../db';
import { donations } from '../db/schema';
import { eq, sum } from 'drizzle-orm';

const router = Router();

// GET all donations
router.get('/', async (req, res) => {
  try {
    const data = await db.select().from(donations);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// GET donations summary (e.g. total infaq)
router.get('/summary', async (req, res) => {
  try {
    // Simple summary using Drizzle sum
    const totalInfaqResult = await db.select({ total: sum(donations.amount) }).from(donations).where(eq(donations.type, 'infaq'));
    res.json({
      totalInfaq: totalInfaqResult[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// POST new donation
router.post('/', async (req, res) => {
  try {
    const { userId, donorName, type, amount, paymentMethod, status } = req.body;
    const newDonation = await db.insert(donations).values({
      userId: userId || null,
      donorName: donorName || null,
      type,
      amount,
      paymentMethod,
      status: status || 'pending'
    }).returning();
    res.status(201).json(newDonation[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create donation' });
  }
});

export default router;
