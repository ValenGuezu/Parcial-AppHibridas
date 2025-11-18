import * as authService from '../services/authService.js';

/**
 * Controlador de autenticación
 * Maneja las peticiones HTTP relacionadas con autenticación
 */

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({
        msg: 'Todos los campos son requeridos: nombre, email, password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        msg: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Registrar usuario
    const nuevoUsuario = await authService.registerUser({
      nombre,
      email,
      password
    });

    // Generar token para el nuevo usuario
    const token = authService.generateToken(nuevoUsuario._id);

    res.status(201).json({
      msg: 'Usuario registrado exitosamente',
      data: nuevoUsuario,
      token
    });
  } catch (error) {
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        msg: 'Error de validación',
        errors
      });
    }

    // Manejar error de email duplicado
    if (error.code === 11000 || error.message.includes('ya está registrado')) {
      return res.status(400).json({
        msg: 'El email ya está registrado'
      });
    }

    // Error genérico
    console.error('❌ Error en register:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      msg: 'Error al registrar usuario',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * POST /api/auth/login
 * Autentica un usuario y retorna token
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        msg: 'Email y contraseña son requeridos'
      });
    }

    // Autenticar usuario
    const { usuario, token } = await authService.loginUser({ email, password });

    res.json({
      msg: 'Login exitoso',
      data: usuario,
      token
    });
  } catch (error) {
    // Error de credenciales inválidas
    if (error.message.includes('Credenciales inválidas')) {
      return res.status(401).json({
        msg: 'Credenciales inválidas'
      });
    }

    // Error genérico
    console.error('Error en login:', error);
    res.status(500).json({
      msg: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

/**
 * GET /api/auth/me
 * Obtiene el perfil del usuario autenticado
 * Requiere: authMiddleware
 */
export const getProfile = async (req, res) => {
  try {
    // El usuario ya está disponible en req.user gracias al authMiddleware
    res.json({
      msg: 'Perfil obtenido exitosamente',
      data: req.user
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({
      msg: 'Error al obtener perfil',
      error: error.message
    });
  }
};

