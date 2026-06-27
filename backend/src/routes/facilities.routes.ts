import { Router } from 'express';
import { db } from '../db';
import { facilities } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// GET /api/facilities
router.get('/', async (req, res) => {
  try {
    const data = await db.select().from(facilities).orderBy(facilities.id);
    res.json(data);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/facilities
router.post('/', async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const [newFacility] = await db.insert(facilities).values({ name, icon, description }).returning();
    res.status(201).json(newFacility);
  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/facilities/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description } = req.body;
    const [updated] = await db.update(facilities)
      .set({ name, icon, description })
      .where(eq(facilities.id, Number(id)))
      .returning();
    
    if (!updated) return res.status(404).json({ error: 'Facility not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating facility:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/facilities/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(facilities).where(eq(facilities.id, Number(id)));
    res.json({ message: 'Facility deleted' });
  } catch (error) {
    console.error('Error deleting facility:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
