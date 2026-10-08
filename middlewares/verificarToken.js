const jwt = require("jsonwebtoken");
const ErrorHttp = require("./ErrorHttp");

function verificarToken(req, res, next) {
  const cabecera = req.header("Authorization");

  if (!cabecera || !cabecera.startsWith("Bearer ")) {
    return next(new ErrorHttp(401, "Token no proporcionado"));
  }

  const token = cabecera.slice(7);

  try {
    req.cuenta = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    next(new ErrorHttp(401, "Token inválido o caducado"));
  }
}

module.exports = verificarToken;
