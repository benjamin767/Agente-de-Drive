const { Router } = require("express");
const router = Router();
const { get_text_pdf, } = require("./controllers/get_data");

router.get('/ultimate', async (req, res) => {
    try {
        res.json(await get_text_pdf());
    } catch (error) {
        console.error(error)
        res.send(error);
    }
});

module.exports = router;