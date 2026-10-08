const ErrorHttp = require("./ErrorHttp");

function rutaNoEncontrada(req, res, next) {
  next(new ErrorHttp(404, "Ruta no encontrada"));
}

function manejadorErrores(err, req, res, next) {
  if (err.status) {
    return res.status(err.status).json({ success: false, error: err.message });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, error: "JSON inválido" });
  }

  console.error(err);
  res.status(500).json({ success: false, error: "Error interno del servidor" });
}

module.exports = { rutaNoEncontrada, manejadorErrores };
