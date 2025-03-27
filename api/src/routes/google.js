const express = require("express");
const router = express.Router();
const { 
    generateAuth, 
    redirect, 
    getData, 
    updateData, 
    get_inbox,
    get_messages,
} = require("./controllers/auth");

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
router.get('/get_inbox', async (req, res) => {
    try {
        const messages_inbox = await get_inbox();
        res.status(200).json({
            msg: "Casilla de entrada abierta...",
            messages_inbox
        })
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message)
    }
});

router.post('/get_messages', async (req, res) => {
    try {
        const { messages } = req.body;
        let  all_messages = await get_messages(messages);
        all_messages = all_messages.map(msg => msg.data.payload)
        all_messages = all_messages.map(msg => msg.parts);
        res.status(200).json({
            msg: "Textos listoss...",
            all_messages
        })
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message)
    }
});

router.put("/update", async (req, res) => {
    try {
        const { sheetName, cells, values, valueInputOption } = req.query;
        await updateData(sheetName, cells, values, valueInputOption);
        res.status(200).json({ msg: "se realizo copado cambio amiguito"});
    } catch(error) {
        console.log(error)
        res.status(404).send(error.message);
    }
});

module.exports = router;