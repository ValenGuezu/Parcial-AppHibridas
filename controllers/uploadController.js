import { upload } from '../middlewares/uploadMiddleware.js';

import multer from 'multer';

/**
 * Controlador para subir una imagen
 * POST /api/upload
 */
export const uploadImage = async (req, res) => {
  try {
    console.log('📤 Upload controller - File received:', req.file ? req.file.filename : 'No file');
    
    if (!req.file) {
      return res.status(400).json({ 
        msg: 'No se proporcionó ningún archivo' 
      });
    }

    // Construir la URL de la imagen
    // En producción, usar la URL de Render
    const baseUrl = process.env.BASE_URL || 
                    process.env.RENDER_EXTERNAL_URL || 
                    `https://back-y-front-apphibridas.onrender.com`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({
      msg: 'Imagen subida exitosamente',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ 
      msg: 'Error al subir la imagen',
      error: error.message 
    });
  }
};

// Middleware para manejar errores de multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        msg: 'El archivo es demasiado grande. Tamaño máximo: 5MB' 
      });
    }
    return res.status(400).json({ 
      msg: 'Error al subir el archivo: ' + err.message 
    });
  }
  
  if (err) {
    return res.status(400).json({ 
      msg: err.message || 'Error al procesar el archivo' 
    });
  }
  
  next();
};

