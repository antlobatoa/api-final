const supabase = require("../config/supabase");
const ErrorHttp = require("../middlewares/ErrorHttp");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErrorHttp(400, "El id debe ser un número entero positivo");
  }
  return id;
}

function validarDatos({ nombre, email, edad }, parcial = false) {
  const datos = {};

  if (nombre !== undefined || !parcial) {
    if (typeof nombre !== "string" || nombre.trim() === "") {
      throw new ErrorHttp(400, "El nombre es obligatorio");
    }
    datos.nombre = nombre.trim();
  }

  if (email !== undefined || !parcial) {
    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      throw new ErrorHttp(400, "El email no es válido");
    }
    datos.email = email.trim().toLowerCase();
  }

  if (edad !== undefined) {
    if (!Number.isInteger(edad) || edad <= 0) {
      throw new ErrorHttp(400, "La edad debe ser un número entero mayor que 0");
    }
    datos.edad = edad;
  }

  if (parcial && Object.keys(datos).length === 0) {
    throw new ErrorHttp(400, "No hay datos para actualizar");
  }

  return datos;
}

function comprobarError(error) {
  if (!error) return;
  if (error.code === "23505") {
    throw new ErrorHttp(409, "Ya existe un usuario con ese email");
  }
  console.error(error);
  throw new ErrorHttp(500, "Error al acceder a la base de datos");
}

async function obtenerUsuarios(req, res) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .order("id");
  comprobarError(error);
  res.json({ success: true, datos: data });
}

async function obtenerUsuario(req, res) {
  const id = validarId(req.params.id);
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  comprobarError(error);
  if (!data) throw new ErrorHttp(404, "Usuario no encontrado");
  res.json({ success: true, datos: data });
}

async function crearUsuario(req, res) {
  const datos = validarDatos(req.body ?? {});
  const { data, error } = await supabase
    .from("usuarios")
    .insert(datos)
    .select()
    .single();
  comprobarError(error);
  res.status(201).json({ success: true, datos: data });
}

async function actualizarUsuario(req, res) {
  const id = validarId(req.params.id);
  const datos = validarDatos(req.body ?? {}, true);
  const { data, error } = await supabase
    .from("usuarios")
    .update(datos)
    .eq("id", id)
    .select()
    .maybeSingle();
  comprobarError(error);
  if (!data) throw new ErrorHttp(404, "Usuario no encontrado");
  res.json({ success: true, datos: data });
}

async function eliminarUsuario(req, res) {
  const id = validarId(req.params.id);
  const { data, error } = await supabase
    .from("usuarios")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();
  comprobarError(error);
  if (!data) throw new ErrorHttp(404, "Usuario no encontrado");
  res.json({ success: true, mensaje: `Usuario ${id} eliminado` });
}

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
