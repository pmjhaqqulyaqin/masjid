import { Router } from 'express';
import { db } from '../db';
import { kajian } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// GET all kajian
router.get('/', async (req, res) => {
  try {
    const data = await db.select().from(kajian).orderBy(kajian.scheduledAt);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch kajian' });
  }
});

// POST new kajian
router.post('/', async (req, res) => {
  try {
    const { title, ustadzName, description, scheduledAt, liveStreamUrl } = req.body;
    const newKajian = await db.insert(kajian).values({
      title,
      ustadzName,
      description,
      scheduledAt: new Date(scheduledAt),
      liveStreamUrl
    }).returning();
    res.status(201).json(newKajian[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create kajian' });
  }
});

// DELETE kajian
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(kajian).where(eq(kajian.id, Number(id)));
    res.status(200).json({ message: 'Kajian deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete kajian' });
  }
});

// PUT update kajian
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ustadzName, description, scheduledAt, liveStreamUrl } = req.body;
    const updated = await db.update(kajian)
      .set({
        title,
        ustadzName,
        description,
        scheduledAt: new Date(scheduledAt),
        liveStreamUrl
      })
      .where(eq(kajian.id, Number(id)))
      .returning();
    res.status(200).json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update kajian' });
  }
});

export default router;
