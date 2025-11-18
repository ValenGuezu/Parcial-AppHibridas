import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para subir imágenes (protegida con JWT)
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  uploadImage
);

// Middleware de manejo de errores de multer (debe ir después de las rutas)
router.use((err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        msg: 'El archivo es demasiado grande. Tamaño máximo: 5MB' 
      });
    }
    if (err.message) {
      return res.status(400).json({ 
        msg: err.message 
      });
    }
    return res.status(400).json({ 
      msg: 'Error al procesar el archivo' 
    });
  }
  next();
});

export default router;

