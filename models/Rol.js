import mongoose from 'mongoose';

const rolSchema = new mongoose.Schema({
  nombre: { type: String, required: true, enum: ['Atacante', 'Defensor'] },
  descripcion: { type: String }
});

const Rol = mongoose.model('Rol', rolSchema);
export default Rol;
