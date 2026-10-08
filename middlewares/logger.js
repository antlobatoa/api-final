function logger(req, res, next) {
  const hora = new Date().toLocaleTimeString("es-ES");
  console.log(`${req.method} ${req.url} - ${hora}`);
  next();
}

module.exports = logger;
