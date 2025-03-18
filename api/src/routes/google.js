const express = require("express");
const router = express.Router();
const { generateAuth, redirect, getData, updateData } = require("./controllers/auth");

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

router.get('/getData', async (req, res) => {
    try {
        const { cells, sheetName } = req.query;
        const data = await getData(sheetName, cells);
        res.status(200).json({
            msg: "good",
            data
        });
    } catch(error) {
        console.log(error);
        res.status(404).send({ msg: error.message });
    }
});

router.put("/update", async (req, res) => {
    try {
        const { sheetName, cells, values, valueInputOption } = req.query;
        await updateData(sheetName, cells, values, valueInputOption);
        res.status(200).json({ msg: "se realizo copado cambio amiguito"});
    } catch(error) {
        res.status(404).send({ msg: error.message });
    }
});

module.exports = router;