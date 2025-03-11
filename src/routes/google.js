const express = require("express");
const router = express.Router();
const { generateAuth, redirect } = require("./controllers/auth");

router.get("/", async (req,res) => {
    const url = await generateAuth();
    console.log("ingresando...");
    res.redirect(url)
});

router.get('/redirect', async (req, res) => {
    const code = req.query.code;
    // Utiliza el código para obtener un token de acceso
    // y llamar a la API de Google
    await redirect(code);
    res.send(`Recibido código: ${code}`);
});

module.exports = router;