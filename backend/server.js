import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './database/jsonDb.js';

// Route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import contactRoutes from './routes/contact.js';
import prescriptionRoutes from './routes/prescriptions.js';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Resolve directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Initialize Database
db.init();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static uploads folder
app.use('/uploads', express.static(UPLOAD_DIR));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Laxmi Narsimha Pharmacy Full-Stack API is running.',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server — auto-increment port if busy
function startServer(port) {
  const numericPort = parseInt(port, 10);
  const server = app.listen(numericPort, () => {
    console.log(`\n✅ Express server is running on http://localhost:${numericPort}`);
    console.log(`   Database : JSON File Store`);
    console.log(`   Mode     : ${process.env.NODE_ENV || 'development'}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[WARN] Port ${numericPort} is busy — trying port ${numericPort + 1}...`);
      startServer(numericPort + 1);
    } else {
      console.error('[SERVER ERROR]', err);
      process.exit(1);
    }
  });
}

startServer(PORT);
