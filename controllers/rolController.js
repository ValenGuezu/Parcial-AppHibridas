import Rol from '../models/Rol.js';

export const getRoles = async (req, res) => {
  try {
    const roles = await Rol.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getRolById = async (req, res) => {
  try {
    const rol = await Rol.findById(req.params.id);
    if (!rol) return res.status(404).json({ error: "No encontrado" });
    res.json(rol);
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const createRol = async (req, res) => {
  try {
    const nuevo = new Rol(req.body);
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(400).json({ error: "Error al crear rol" });
  }
};

export const updateRol = async (req, res) => {
  try {
    const actualizado = await Rol.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: "No encontrado" });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar rol" });
  }
};

export const deleteRol = async (req, res) => {
  try {
    const eliminado = await Rol.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};
