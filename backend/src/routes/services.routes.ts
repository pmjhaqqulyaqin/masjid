import { Router } from 'express';
import { db } from '../db';
import { services } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// GET all service requests
router.get('/', async (req, res) => {
  try {
    const data = await db.select().from(services).orderBy(services.createdAt);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// POST new service request
router.post('/', async (req, res) => {
  try {
    const { userId, serviceType, formData } = req.body;
    const newRequest = await db.insert(services).values({
      userId,
      serviceType,
      formData,
      status: 'pending'
    }).returning();
    res.status(201).json(newRequest[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service request' });
  }
});

// PUT update service status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updated = await db.update(services)
      .set({ status })
      .where(eq(services.id, Number(id)))
      .returning();
      
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
