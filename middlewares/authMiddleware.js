import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

/**
 * Middleware para verificar el token JWT en las rutas protegidas
 * 
 * Uso:
 * router.get('/ruta-protegida', authMiddleware, controlador);
 * 
 * El middleware:
 * 1. Extrae el token del header Authorization
 * 2. Verifica que el token sea válido
 * 3. Busca el usuario en la base de datos
 * 4. Agrega el usuario al objeto req para uso en los controladores
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    // Formato esperado: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        msg: 'Token no proporcionado. Debe incluir el header Authorization.' 
      });
    }

    // Separar "Bearer" del token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        msg: 'Formato de token inválido. Use: Bearer <token>' 
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findById(decoded.userId).select('-password');

    if (!usuario) {
      return res.status(401).json({ 
        msg: 'Usuario no encontrado. Token inválido.' 
      });
    }

    // Agregar el usuario al objeto req para uso en los controladores
    req.user = usuario;
    
    // Continuar con el siguiente middleware o controlador
    next();
  } catch (error) {
    // Manejar diferentes tipos de errores de JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        msg: 'Token inválido.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        msg: 'Token expirado. Por favor, inicia sesión nuevamente.' 
      });
    }

    // Error del servidor
    console.error('Error en authMiddleware:', error);
    return res.status(500).json({ 
      msg: 'Error al verificar el token.' 
    });
  }
};

/**
 * Middleware opcional para verificar si el usuario es admin
 * Debe usarse después de authMiddleware
 * 
 * Uso:
 * router.delete('/admin/ruta', authMiddleware, isAdmin, controlador);
 */
export const isAdmin = (req, res, next) => {
  // Si el modelo Usuario tiene un campo 'rol' o 'isAdmin', verificarlo aquí
  // Por ahora, este es un ejemplo que puedes adaptar según tu modelo
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      msg: 'Acceso denegado. Se requieren permisos de administrador.' 
    });
  }
};

