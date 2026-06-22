import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { db } from '../database/jsonDb.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      cb(null, UPLOAD_DIR);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, and PDF files are allowed!'));
    }
  }
});

// @route   POST /api/prescriptions
// @desc    Upload a new prescription
// @access  Public
router.post('/', (req, res) => {
  upload.single('prescriptionCopy')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { name, phone, deliveryOption, address, notes } = req.body;

      if (!name || !phone || !deliveryOption) {
        // If file was uploaded, clean it up
        if (req.file) {
          await fs.unlink(req.file.path).catch(console.error);
        }
        return res.status(400).json({ success: false, message: 'Please provide name, phone, and delivery option.' });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a prescription file copy.' });
      }

      const prescriptionData = {
        name,
        phone,
        deliveryOption,
        address: address || '',
        notes: notes || '',
        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          url: `/uploads/${req.file.filename}`
        }
      };

      const newPrescription = await db.insertOne('prescriptions', prescriptionData);

      res.status(201).json({
        success: true,
        message: 'Prescription uploaded and saved successfully.',
        prescription: newPrescription
      });
    } catch (error) {
      console.error("Prescription Upload Route Error:", error);
      // Clean up uploaded file in case of error
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      res.status(500).json({ success: false, message: 'Server error uploading prescription.' });
    }
  });
});

// @route   GET /api/prescriptions
// @desc    Get all prescriptions (Admin only)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const prescriptions = await db.getCollection('prescriptions');
    // Sort by createdAt descending
    prescriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, prescriptions });
  } catch (error) {
    console.error("Fetch Prescriptions Error:", error);
    res.status(500).json({ success: false, message: 'Server error fetching prescriptions.' });
  }
});

// @route   DELETE /api/prescriptions/:id
// @desc    Delete prescription record and file (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const prescription = await db.findOne('prescriptions', { id });

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }

    // Delete file from uploads directory
    if (prescription.file && prescription.file.filename) {
      const filePath = path.join(UPLOAD_DIR, prescription.file.filename);
      await fs.unlink(filePath).catch(err => {
        console.error(`Failed to delete file at ${filePath}:`, err.message);
      });
    }

    const deleted = await db.deleteOne('prescriptions', { id });
    if (deleted) {
      res.json({ success: true, message: 'Prescription deleted successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Could not delete prescription record.' });
    }
  } catch (error) {
    console.error("Delete Prescription Error:", error);
    res.status(500).json({ success: false, message: 'Server error deleting prescription.' });
  }
});

export default router;
