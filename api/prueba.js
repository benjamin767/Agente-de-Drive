const fs = require('fs');
const pdf = require('pdf-parse');
// oauth2Client.getToken(code, (err, tokens) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Token de acceso:', tokens.access_token);
//   }
// });
// const drive = google.drive({ version: 'v3', auth: oauth2Client });

// drive.files.create({
//     requestBody: {
//     name: 'Test',
//     mimeType: 'text/plain'
//   },
//   media: {
//     mimeType: 'text/plain',
//     body: 'Hola, mundo!'
//   }
// }, (err, file) => {
//   if (err) {
//       console.error(err);
//   } else {
//     console.log(`ID del archivo: ${JSON.stringify(file)}`);
//   }
// });

let dataBuffer = fs.readFileSync('C:\\Users\\ebarros\\Downloads\\Codem.pdf');
 
pdf(dataBuffer).then(function(data) {
    // PDF text
    drive.files.create({
      requestBody: {
        name: 'Test',
        mimeType: 'text/plain'
      },
      media: {
        mimeType: 'text/plain',
        body: data.text
      }
    });
});