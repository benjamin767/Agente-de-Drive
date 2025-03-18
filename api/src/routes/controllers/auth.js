const { google } = require('googleapis');
const axios = require("axios");
const { CLIENT_SECRET, REDIRECT_URL, CLIENT_ID, API_KEY, spreadsheetId } = process.env;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/gmail.readonly'];

const drive = google.drive({ 
    version: 'v3', 
    auth: oauth2Client 
});
const sheets = google.sheets('v4')

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
        console.log("cuenta vinculada re copado");
    },
    getData: async (sheetName,cells) => {
        const range = `${sheetName}!${cells}`;
        let data = await sheets.spreadsheets.values.get({
            spreadsheetId,
            auth: oauth2Client,
            range,
        });
        return data.data;
    },
    updateData: async (sheetName, cells, values, valueInputOption) => {
        const body = { values };
        const range = `${sheetName}!${cells}`;
       await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: valueInputOption,
            resource: body,
        });
    }
}