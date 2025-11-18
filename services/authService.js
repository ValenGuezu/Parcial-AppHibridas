import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

/**
 * Servicio de autenticación
 * Contiene la lógica de negocio para autenticación y generación de tokens
 */

/**
 * Genera un token JWT para un usuario
 * @param {Object} userId - ID del usuario
 * @returns {String} Token JWT
 */
export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
  }
  
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario (nombre, email, password)
 * @returns {Object} Usuario creado (sin password)
 */
export const registerUser = async (userData) => {
  const { nombre, email, password } = userData;

  // Validaciones básicas
  if (!nombre || !email || !password) {
    throw new Error('Todos los campos son requeridos');
  }

  // Verificar si el usuario ya existe
  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  try {
    // Crear nuevo usuario (la contraseña se encripta automáticamente en el pre-save)
    const nuevoUsuario = new Usuario({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password: password
    });

    await nuevoUsuario.save();

    // Retornar usuario sin password (gracias al método toJSON)
    return nuevoUsuario;
  } catch (error) {
    console.error('❌ Error al guardar usuario:', error);
    // Si es un error de validación de Mongoose, lanzarlo tal cual
    if (error.name === 'ValidationError') {
      throw error;
    }
    // Si es un error de duplicado
    if (error.code === 11000) {
      throw new Error('El email ya está registrado');
    }
    // Otro error
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
};

/**
 * Autentica un usuario y genera token
 * @param {Object} credentials - Credenciales (email, password)
 * @returns {Object} { usuario, token }
 */
export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Buscar usuario por email
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar contraseña
  const isPasswordValid = await usuario.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  // Generar token
  const token = generateToken(usuario._id);

  // Retornar usuario (sin password) y token
  return {
    usuario,
    token
  };
};

/**
 * Obtiene un usuario por ID (sin password)
 * @param {String} userId - ID del usuario
 * @returns {Object} Usuario
 */
export const getUserById = async (userId) => {
  const usuario = await Usuario.findById(userId).select('-password');
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }
  return usuario;
};

