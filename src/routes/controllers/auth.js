const { google } = require('googleapis');
const axios = require("axios");
const { CLIENT_SECRET, REDIRECT_URL, CLIENT_ID, API_KEY } = process.env;

const drive = google.drive({ 
    version: 'v3', 
    auth: API_KEY 
});

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);
const scopes = ['https://www.googleapis.com/auth/drive'];

module.exports = {
    generateAuth: async () => {
        // Obtén el código de autorización del usuario
        const authUrl = await oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
        console.log(authUrl)
        return authUrl;
    },
    redirect: async (code) => {
        const { tokens } = oauth2Client.getToken(code);
        await oauth2Client.setCredentials(tokens);
        console.log("cuenta vinculada re copado")
    }   
}