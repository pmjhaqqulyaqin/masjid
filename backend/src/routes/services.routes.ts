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
    const payload = {
      userId,
      serviceType,
      formData,
      status: 'pending'
    };
    const [result] = await db.insert(services).values(payload);
    res.status(201).json({ id: result.insertId, ...payload });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service request' });
  }
});

// PUT update service status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await db.update(services)
      .set({ status })
      .where(eq(services.id, Number(id)));
      
    res.json({ id: Number(id), status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
