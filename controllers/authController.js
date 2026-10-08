const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");
const ErrorHttp = require("../middlewares/ErrorHttp");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function register(req, res) {
  const { nombre, email, password } = req.body ?? {};

  if (typeof nombre !== "string" || nombre.trim() === "") {
    throw new ErrorHttp(400, "El nombre es obligatorio");
  }
  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    throw new ErrorHttp(400, "El email no es válido");
  }
  if (typeof password !== "string" || password.length < 6) {
    throw new ErrorHttp(400, "La contraseña debe tener al menos 6 caracteres");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("cuentas")
    .insert({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
    })
    .select("id, nombre, email")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new ErrorHttp(409, "Ya existe una cuenta con ese email");
    }
    console.error(error);
    throw new ErrorHttp(500, "Error al acceder a la base de datos");
  }

  res.status(201).json({ success: true, datos: data });
}

async function login(req, res) {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    throw new ErrorHttp(400, "Email y contraseña son obligatorios");
  }

  const { data: cuenta, error } = await supabase
    .from("cuentas")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new ErrorHttp(500, "Error al acceder a la base de datos");
  }

  // Mismo mensaje si falla el email o la contraseña
  const coincide =
    cuenta && (await bcrypt.compare(password, cuenta.password_hash));
  if (!coincide) {
    throw new ErrorHttp(401, "Credenciales incorrectas");
  }

  const token = jwt.sign(
    { id: cuenta.id, email: cuenta.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ success: true, token });
}

async function perfil(req, res) {
  const { data, error } = await supabase
    .from("cuentas")
    .select("id, nombre, email, creado_en")
    .eq("id", req.cuenta.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new ErrorHttp(500, "Error al acceder a la base de datos");
  }
  if (!data) throw new ErrorHttp(404, "Cuenta no encontrada");

  res.json({ success: true, datos: data });
}

module.exports = { register, login, perfil };
