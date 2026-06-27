import { Router } from 'express';
import { db } from '../db';
import { settings } from '../db/schema';
import { eq } from 'drizzle-orm';
import multer from 'multer';
import path from 'path';

const router = Router();

// Konfigurasi Multer untuk upload file (gambar)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Simpan di folder public/uploads
    cb(null, path.join(__dirname, '../../public/uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// GET /api/settings - Ambil semua setting
router.get('/', async (req, res) => {
  try {
    const allSettings = await db.select().from(settings);
    // Convert array of {key, value} to object
    const settingsObj = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/settings - Simpan/Update multiple settings
router.post('/', async (req, res) => {
  try {
    const data = req.body; 
    
    for (const [key, value] of Object.entries(data)) {
      await db.insert(settings)
        .values({ key, value: String(value) })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value: String(value) }
        });
    }

    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/settings/upload - Upload file and return URL
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return relative URL that can be accessed via static server
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
