import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;
const COACH_PIN = "2906";

const DATA_DIR = path.resolve('data');
const UPLOADS_DIR = path.resolve('data/uploads');
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const DEFAULT_TESTIMONIALS = [
  {
    id: "51096841-3ce3-4d44-a569-9a6b465ade41",
    name: "भागवतराव देशमुख (वेलनेस कोच)",
    weight_note: "वजन: ७६ किलो → ६१ किलो (१५ किलो निरोगी वजन घटवले)",
    image_url: "/testimonials/51096841-3ce3-4d44-a569-9a6b465ade41.jpg",
    created_at: "2026-11-08T08:49:05.942Z",
    pinned: true,
  },
  {
    id: "c8e192a4-7f89-4b11-9a25-e5f8841a0e62",
    name: "रामेश्वरी कुमावत",
    weight_note: "वजन घट व फिटनेस परिवर्तन — ऊर्जा व निरोगी जीवनशैली",
    image_url: "/testimonials/rameshwari_kumawat.jpg",
    created_at: "2026-11-08T10:00:00.000Z",
    pinned: false,
  },
  {
    id: "8c1ba433-0d13-4c5c-9dd6-fa2e5fbbae84",
    name: "सुशिल मोहाळे",
    weight_note: "वजन घट व फिटनेस परिवर्तन — ऊर्जा व स्टॅमिना सुधारला",
    image_url: "/testimonials/8c1ba433-0d13-4c5c-9dd6-fa2e5fbbae84.jpg",
    created_at: "2026-11-08T08:49:04.942Z",
    pinned: false,
  },
];

function readTestimonials(): any[] {
  try {
    if (!fs.existsSync(TESTIMONIALS_FILE)) {
      fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(DEFAULT_TESTIMONIALS, null, 2));
      return DEFAULT_TESTIMONIALS;
    }
    const raw = fs.readFileSync(TESTIMONIALS_FILE, 'utf-8');
    const list = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) {
      return DEFAULT_TESTIMONIALS;
    }
    return list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  } catch (err) {
    console.error('Failed reading testimonials', err);
    return DEFAULT_TESTIMONIALS;
  }
}

function writeTestimonials(list: any[]) {
  const sorted = [...list].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });
  fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(sorted, null, 2), 'utf-8');
  return sorted;
}

// Enable 25mb payload for high-res photo uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static route for uploaded before/after photos and public assets
app.use('/api/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.resolve('public')));

// GET all testimonials (visible to everyone)
app.get('/api/testimonials', (_req, res) => {
  const list = readTestimonials();
  res.json(list);
});

// POST new testimonial (protected by PIN 2906)
app.post('/api/testimonials', (req, res) => {
  const { name, weight_note, image, pin } = req.body;

  if (String(pin).trim() !== COACH_PIN) {
    res.status(401).json({ error: 'पिन चुकीचा आहे (Invalid PIN)' });
    return;
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'नाव आवश्यक आहे' });
    return;
  }

  if (!image || typeof image !== 'string') {
    res.status(400).json({ error: 'फोटो आवश्यक आहे' });
    return;
  }

  const id = 'story-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  let finalImageUrl = image;

  // If base64 data url, save as image file on disk
  if (image.startsWith('data:image/')) {
    try {
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].includes('png') ? '.png' : '.jpg';
        const filename = `${id}${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
        finalImageUrl = `/api/uploads/${filename}`;
      }
    } catch (saveErr) {
      console.error('Failed saving image to disk', saveErr);
      // Fallback to saving data URL directly
      finalImageUrl = image;
    }
  }

  const newEntry = {
    id,
    name: name.trim(),
    weight_note: weight_note ? String(weight_note).trim() : '',
    image_url: finalImageUrl,
    created_at: new Date().toISOString(),
    pinned: false,
  };

  const current = readTestimonials();
  const updated = writeTestimonials([newEntry, ...current]);
  res.status(201).json({ story: newEntry, all: updated });
});

// DELETE testimonial by ID (protected by PIN 2906)
app.delete('/api/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const pin = req.query.pin || req.body?.pin;

  if (String(pin).trim() !== COACH_PIN) {
    res.status(401).json({ error: 'पिन चुकीचा आहे (Invalid PIN)' });
    return;
  }

  const current = readTestimonials();
  const target = current.find((t) => t.id === id);

  if (!target) {
    res.status(404).json({ error: 'यशोगाथा सापडली नाही' });
    return;
  }

  // Remove uploaded file if it exists on disk
  if (target.image_url && target.image_url.startsWith('/api/uploads/')) {
    const filename = path.basename(target.image_url);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Error removing file', e);
      }
    }
  }

  const filtered = current.filter((t) => t.id !== id);
  const updated = writeTestimonials(filtered);
  res.json({ success: true, all: updated });
});

// PATCH toggle pin status (protected by PIN 2906)
app.patch('/api/testimonials/:id/pin', (req, res) => {
  const { id } = req.params;
  const pin = req.query.pin || req.body?.pin;

  if (String(pin).trim() !== COACH_PIN) {
    res.status(401).json({ error: 'पिन चुकीचा आहे (Invalid PIN)' });
    return;
  }

  const current = readTestimonials();
  const updated = current.map((t) => {
    if (t.id === id) {
      return { ...t, pinned: !t.pinned };
    }
    return t;
  });

  const sorted = writeTestimonials(updated);
  res.json({ success: true, all: sorted });
});

// POST reset to defaults (protected by PIN 2906)
app.post('/api/testimonials/reset', (req, res) => {
  const { pin } = req.body;
  if (String(pin).trim() !== COACH_PIN) {
    res.status(401).json({ error: 'पिन चुकीचा आहे' });
    return;
  }

  const sorted = writeTestimonials(DEFAULT_TESTIMONIALS);
  res.json({ success: true, all: sorted });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development: Integrate Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static build from dist
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server online on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
