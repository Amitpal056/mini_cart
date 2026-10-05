import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 5000;
const frontendPath = path.resolve(fileURLToPath(new URL('..', import.meta.url)), 'dist');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

app.get('/api/health', (_request, response) => {
  response.json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'disconnected' });
});

app.get('/api/products', async (_request, response) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 }).lean();
    response.json(products);
  } catch (error) {
    console.error('Could not load products:', error.message);
    response.status(500).json({ message: 'Could not load products.' });
  }
});

app.use(express.static(frontendPath));
app.use((request, response, next) => {
  if (request.method !== 'GET' || request.path.startsWith('/api/')) {
    return next();
  }

  response.sendFile(path.join(frontendPath, 'index.html'), (error) => {
    if (error) next(error);
  });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Add it to server/.env.');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  app.listen(port, () => {
    console.log(`Product API listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(`Could not start the product API: ${error.message}`);
  process.exitCode = 1;
});