import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure folders exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};
ensureDir(path.join(__dirname, '../../Images'));
ensureDir(path.join(__dirname, '../../Videos'));

// Multer storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../Images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Multer storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../Videos'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

// Image upload endpoint
router.post('/image', uploadImage.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Always return HTTPS URL for frontend
 const url = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`;
  res.json({ url });
});

// Video upload endpoint
router.post('/video', uploadVideo.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Always return HTTPS URL for frontend
   const url = `${req.protocol}://${req.get('host')}/Videos/${req.file.filename}`;
  res.json({ url });
});

// Serve static files for uploaded images and videos (add this to your main server file, e.g., index.js)
// app.use('/Images', express.static(path.join(__dirname, '../Images')));
// app.use('/Videos', express.static(path.join(__dirname, '../Videos')));

export default router
