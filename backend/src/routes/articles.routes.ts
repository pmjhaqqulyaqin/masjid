import { Router } from 'express';
import { db } from '../db';
import { articles } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import multer from 'multer';
import path from 'path';

export const articlesRouter = Router();

// Konfigurasi Multer untuk upload gambar ke frontend/public/gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Kita simpan di folder frontend/public/gambar
    cb(null, path.join(__dirname, '../../../frontend/public/gambar'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET all articles
articlesRouter.get('/', async (req, res) => {
  try {
    const data = await db.select().from(articles).orderBy(desc(articles.publishedAt));
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// POST new article (with image upload)
articlesRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    const { type, title, content, author, publishedAt } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = '/gambar/' + req.file.filename;
    }

    const [newArticle] = await db.insert(articles).values({
      type,
      title,
      content,
      author: author || null,
      imageUrl,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date()
    }).returning();

    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// PUT (Update) article (with optional new image)
articlesRouter.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, content, author, publishedAt } = req.body;
    
    const updateData: any = {
      type,
      title,
      content,
      author: author || null,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date()
    };

    if (req.file) {
      updateData.imageUrl = '/gambar/' + req.file.filename;
    }

    const [updatedArticle] = await db.update(articles)
      .set(updateData)
      .where(eq(articles.id, parseInt(id)))
      .returning();

    res.json(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// DELETE article
articlesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(articles).where(eq(articles.id, parseInt(id)));
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});
