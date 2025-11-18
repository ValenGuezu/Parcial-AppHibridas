import mongoose from 'mongoose';

const agenteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  pais: String,
  biografia: String,
  fotoUrl: { 
    type: String, 
    default: 'https://via.placeholder.com/400x600/1a1a1a/ffffff?text=Agente+R6S'
  },
  rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol', required: true }
});

const Agente = mongoose.model('Agente', agenteSchema);
export default Agente;
