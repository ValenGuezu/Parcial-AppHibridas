import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routerApi from './routes/index.js';

dotenv.config();

const urldb = process.env.MONGODB_URI || process.env.URI_DB;
mongoose.connect(urldb);
const db = mongoose.connection;

db.on('error', () => { console.error('Error de conexión') });
db.on('open', () => { console.log('Conexión con la DB') });

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

// Página principal
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/', express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.send('<h1>API REST</h1>');
});

routerApi(app);

app.listen(PORT, () => {
  console.log(`API REST en el puerto ${PORT}`);
});
