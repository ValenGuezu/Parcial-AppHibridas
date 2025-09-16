import mongoose from 'mongoose';

const agenteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  pais: String,
  biografia: String,
  rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol', required: true }
});

const Agente = mongoose.model('Agente', agenteSchema);
export default Agente;
