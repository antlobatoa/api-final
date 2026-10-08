const express = require("express");
const { register, login, perfil } = require("../controllers/authController");
const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/perfil", verificarToken, perfil);

module.exports = router;
