import { Router } from 'express';
import { db } from '../db';
import { ibadah } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// GET all ibadah jadwal
router.get('/jadwal', async (req, res) => {
  try {
    const data = await db.select().from(ibadah).orderBy(ibadah.time);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ibadah jadwal' });
  }
});

// POST new ibadah jadwal
router.post('/jadwal', async (req, res) => {
  try {
    const { prayerType, time, imamName, muadzinName, khatibName, bilalName } = req.body;
    const newData = await db.insert(ibadah).values({
      prayerType,
      time: new Date(time),
      imamName: imamName || null,
      muadzinName: muadzinName || null,
      khatibName: khatibName || null,
      bilalName: bilalName || null,
    }).returning();
    res.status(201).json(newData[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ibadah jadwal' });
  }
});

// PUT update ibadah jadwal
router.put('/jadwal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { prayerType, time, imamName, muadzinName, khatibName, bilalName } = req.body;
    const updated = await db.update(ibadah)
      .set({
        prayerType,
        time: new Date(time),
        imamName: imamName || null,
        muadzinName: muadzinName || null,
        khatibName: khatibName || null,
        bilalName: bilalName || null,
      })
      .where(eq(ibadah.id, Number(id)))
      .returning();
    res.status(200).json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ibadah jadwal' });
  }
});

// DELETE ibadah jadwal
router.delete('/jadwal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(ibadah).where(eq(ibadah.id, Number(id)));
    res.status(200).json({ message: 'Ibadah jadwal deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ibadah jadwal' });
  }
});

export default router;
