require("dotenv").config();
const express = require("express");
const logger = require("./middlewares/logger");
const verificarToken = require("./middlewares/verificarToken");
const {
  rutaNoEncontrada,
  manejadorErrores,
} = require("./middlewares/manejadorErrores");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.json({ success: true, mensaje: "API de usuarios funcionando" });
});

app.use("/auth", require("./routes/auth"));
app.use("/usuarios", verificarToken, require("./routes/usuarios"));

app.use(rutaNoEncontrada);
app.use(manejadorErrores);

app.listen(PORT, () => {
  console.log(`Servidor en marcha en http://localhost:${PORT}`);
});
