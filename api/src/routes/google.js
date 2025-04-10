const express = require("express");
const router = express.Router();
const { 
    generateAuth, 
    redirect, 
    getData, 
    updateData, 
    get_inbox,
    get_messages,
    get_attachment,
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

router.get('/get_attachment', async (req, res) => {
    
    try {
        const { attachmentId, messageId, filename } = req.query;
        const buffer = await get_attachment(attachmentId, messageId);
        let contentType;
        if (buffer.toString('hex', 0, 4) === '25504446') { // PDF
            contentType = 'application/pdf';
        } else if (buffer.toString('hex', 0, 3) === 'ffd8ff') { // JPEG
            contentType = 'image/jpeg';
        } else if (buffer.toString('hex', 0, 8) === '89504e470d0a1a0a') { // PNG
            contentType = 'image/png';
        } else if (buffer.toString('hex', 0, 4) === '47494638') { // GIF
            contentType = 'image/gif';
        } else if (buffer.toString('hex', 0, 2) === '424d') { // BMP
            contentType = 'image/bmp';
        } else {
            contentType = 'application/octet-stream'; // Tipo de contenido por defecto
        }

        // Envía el archivo como respuesta
        res.set("Content-Disposition", `attachment; filename="${filename}"`);
        res.set("Content-Type", contentType);
        res.status(200).send(buffer)
    } catch(error) {
        console.error(error);
        res.status(404).send(error.message);
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

        all_messages = all_messages.map(msg =>  {
            return {
                payload: msg.data.payload,
                messageId: msg.data.id
            }
        })
        
        res.status(200).json({
            msg: "Textos listoss...",
            all_messages
        })
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message)
    }
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
        console.log(error)
        res.status(404).send(error.message);
    }
});

module.exports = router;