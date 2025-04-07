const { google } = require('googleapis');
const fs = require('fs');
const { CLIENT_SECRET, REDIRECT_URL, CLIENT_ID, spreadsheetId, email_password } = process.env;
const FormData = require('form-data');

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
const gmail = google.gmail('v1');

async function getAccessToken() {
  try {
    const tokens = await oauth2Client.getAccessToken();
    return tokens;
  } catch (error) {
    console.error(error);
  }
}
  
module.exports = {
  get_attachment: async (attachmentId, messageId) => {
    const res = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId: messageId,
      id: attachmentId,
      auth: oauth2Client
    });
    console.log(res)
    const buffer = Buffer.from(res.data.data, 'base64');
    // fs.writeFileSync(`archivo.pdf`, buffer);
    // Descargar archivo adjunto
    // const fileStream = fs.createWriteStream('archivo.pdf');
    // fileStream.write(fileBuffer);
    console.log(buffer);
    return buffer;
  },
  get_inbox: async () => {
    const res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      auth: oauth2Client,
    });
    return res.data.messages;   
  },
  get_messages: async (messages) => {
    let all_messages = [];
      messages.forEach((message) => {
      const messageId = message.id;
      const res = gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        auth: oauth2Client,
      });
      all_messages = [...all_messages, res ];
    }); 
    all_messages = Promise.all(all_messages).then(res => res);
    return all_messages;
  },
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
    })
    return data.data;
  },
  updateData: async (sheetName, cells, values) => {
    values= [ [ values ], ];
    const range = `${sheetName}!${cells}`;
    const body = {
      values,
    };
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      valueInputOption: "USER_ENTERED",
      resource: body,
      range,
      auth: oauth2Client,
    });
  }
}