import Agente from '../models/Agente.js';
import Rol from '../models/Rol.js';

// Obtener todos los agentes (con filtros simples por rol o nombre exacto)
export const getAgentes = async (req, res) => {
  try {
    const { rol, nombre } = req.query;
    let query = {};

    if (nombre) query.nombre = nombre;

    if (rol) {
      const rolDoc = await Rol.findOne({ nombre: rol });
      if (rolDoc) query.rol = rolDoc._id;
    }

    // Usar populate para obtener el objeto completo del rol
    const agentes = await Agente.find(query).populate('rol', 'nombre descripcion');
    res.json(agentes);
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getAgenteById = async (req, res) => {
  try {
    // Usar populate para obtener el objeto completo del rol
    const agente = await Agente.findById(req.params.id).populate('rol', 'nombre descripcion');
    if (!agente) return res.status(404).json({ error: "No encontrado" });
    res.json(agente);
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const createAgente = async (req, res) => {
  try {
    const nuevo = new Agente(req.body);
    const guardado = await nuevo.save();
    // Usar populate para devolver el rol completo
    const agenteCompleto = await Agente.findById(guardado._id).populate('rol', 'nombre descripcion');
    res.status(201).json(agenteCompleto);
  } catch (err) {
    res.status(400).json({ error: "Error al crear agente" });
  }
};

export const updateAgente = async (req, res) => {
  try {
    const actualizado = await Agente.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('rol', 'nombre descripcion');
    if (!actualizado) return res.status(404).json({ error: "No encontrado" });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar agente" });
  }
};

export const deleteAgente = async (req, res) => {
  try {
    const eliminado = await Agente.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};
