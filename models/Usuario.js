import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  email: { 
    type: String, 
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
  },
  password: { 
    type: String, 
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  }
}, { timestamps: true });

// Middleware pre-save: encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña fue modificada
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generar salt y encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para eliminar password del JSON (no incluir en respuestas)
usuarioSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model('Usuario', usuarioSchema);
