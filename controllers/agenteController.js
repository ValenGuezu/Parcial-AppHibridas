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

    const agentes = await Agente.find(query);
    res.json(agentes);
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getAgenteById = async (req, res) => {
  try {
    const agente = await Agente.findById(req.params.id);
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
    res.status(201).json(guardado);
  } catch (err) {
    res.status(400).json({ error: "Error al crear agente" });
  }
};

export const updateAgente = async (req, res) => {
  try {
    const actualizado = await Agente.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
