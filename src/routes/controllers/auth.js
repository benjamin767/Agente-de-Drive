const { google } = require('googleapis');
const axios = require("axios");
const { CLIENT_SECRET, REDIRECT_URL, CLIENT_ID, API_KEY, spreadsheetId } = process.env;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/gmail.readonly'];

async function getAccessToken() {
    try {
      const tokens = await oauth2Client.getAccessToken();
      return tokens;
    } catch (error) {
      console.error(error);
    }
}
  
module.exports = {
    generateAuth: async () => {
        // Obtén el código de autorización del usuario
        const authUrl = await oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes.join(" ")
        });
        console.log(authUrl)
        return authUrl;
    },
    redirect: async (code) => {
        const { tokens } = await oauth2Client.getToken(code);
        await oauth2Client.setCredentials(tokens);
        console.log("cuenta vinculada re copado")
        const drive = google.drive({ 
            version: 'v3', 
            auth: oauth2Client 
        });
        const sheets = google.sheets('v4')
        const sheetName = 'Hoja 1';
        const range = `${sheetName}!A1:B2`;
        await sheets.spreadsheets.get({
            spreadsheetId,
            auth: oauth2Client,
            range,
        }, (err, response) => {
            if (err) {
                console.error(err);
            } else {
                console.log(response.data.values);
            }
        });
    }   
}