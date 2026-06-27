import { Router } from 'express';
import { db } from '../db';
import { finances } from '../db/schema';
import { eq, sum } from 'drizzle-orm';

const router = Router();

// GET all finance records
router.get('/', async (req, res) => {
  try {
    const data = await db.select().from(finances).orderBy(finances.date);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch finances' });
  }
});

// GET finance summary
router.get('/summary', async (req, res) => {
  try {
    const incomeResult = await db.select({ total: sum(finances.amount) }).from(finances).where(eq(finances.type, 'income'));
    const expenseResult = await db.select({ total: sum(finances.amount) }).from(finances).where(eq(finances.type, 'expense'));
    
    const totalIncome = parseFloat(incomeResult[0]?.total || '0');
    const totalExpense = parseFloat(expenseResult[0]?.total || '0');
    
    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// POST new finance record
router.post('/', async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;
    const newFinance = await db.insert(finances).values({
      type,
      category,
      amount,
      description,
      date: new Date(date || Date.now())
    }).returning();
    res.status(201).json(newFinance[0]);
  } catch (error) {
    console.error('Create finance error:', error);
    res.status(500).json({ error: 'Failed to create finance record', details: String(error) });
  }
});

export default router;
