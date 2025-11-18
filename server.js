import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routerApi from './routes/index.js';

dotenv.config();

const urldb = process.env.MONGODB_URI || process.env.URI_DB;

if (!urldb) {
  console.error('❌ ERROR: MONGODB_URI no está definido en el archivo .env');
  console.error('Por favor, crea un archivo .env en la carpeta Backend/ con:');
  console.error('MONGODB_URI=mongodb://localhost:27017/r6_parcial');
  console.error('PORT=3000');
  console.error('JWT_SECRET=tu_clave_secreta');
  console.error('JWT_EXPIRES_IN=24h');
  process.exit(1);
}

// Verificar que JWT_SECRET esté configurado
if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET no está definido en las variables de entorno');
  console.error('Por favor, configura JWT_SECRET en Render o en el archivo .env');
  process.exit(1);
}

mongoose.connect(urldb);
const db = mongoose.connection;

db.on('error', () => { console.error('Error de conexión') });
db.on('open', () => { console.log('Conexión con la DB') });

const PORT = process.env.PORT || 3000;
const app = express();

// Configuración de CORS explícita - Permite todos los orígenes
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir todos los orígenes (para desarrollo y producción)
    // Si quieres restringir en producción, puedes especificar orígenes aquí
    callback(null, true);
  },
  credentials: false, // No usar credentials con origin: '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 horas para cachear preflight
};

app.use(cors(corsOptions));
// Aumentar el límite de tamaño del body para permitir imágenes en base64 (hasta 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Página principal
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/', express.static(path.join(__dirname, 'views')));

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('<h1>API REST</h1>');
});

routerApi(app);

app.listen(PORT, () => {
  console.log(`API REST en el puerto ${PORT}`);
});
