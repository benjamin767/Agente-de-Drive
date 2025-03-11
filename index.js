'use strict';
require('dotenv').config();
const server = require("./src/app.js");
const port = process.env.PORT || 3002;

// Syncing all the models at once.
server.listen(port, () => {
  console.log(`%s listening at ${port}`); // eslint-disable-line no-console
});
