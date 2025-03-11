const { Router } = require("express");
// const trademarkMiddleware = require('./Trademark');
// Ejemplo: const auth Router = require('./auth.js');
// Ejemplo: const authRouter = require('./auth.js');
const authGoogle = require("./google");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);                                                                                                                                                                                                                        
// router.use('/trademarks', trademarkMiddleware);
router.use("/", authGoogle);

module.exports = router;