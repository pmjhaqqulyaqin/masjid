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
    const { userId, donorName, type, amount, paymentMethod, status, proofUrl } = req.body;
    const payload = {
      userId: userId || null,
      donorName: donorName || null,
      type,
      amount,
      paymentMethod,
      status: status || 'pending',
      proofUrl: proofUrl || null
    };
    const [result] = await db.insert(donations).values(payload);
    res.status(201).json({ id: result.insertId, ...payload });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create donation' });
  }
});

// PUT update donation status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'success', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [updated] = await db.update(donations)
      .set({ status })
      .where(eq(donations.id, Number(id)));

    if (updated.affectedRows === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    res.json({ id: Number(id), status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update donation status' });
  }
});

export default router;
