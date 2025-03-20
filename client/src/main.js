const { app, BrowserWindow, Menu } = require("electron");
const url = require("url");
const path = require("path");

let mainWindow

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 800,
        title: "Agentes de Excel",
        webPreferences: {
            nodeIntegration: true
        }
    });
    console.log(__dirname);
    mainWindow.loadURL(`${__dirname}/views/configuration.html`);

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);
    mainWindow.on("closed", () => {
        app.quit();
    });
});

const templateMenu = [
    {
        label: "Archivo",
        submenu: [
            {
                label: "Conectar a google",
                click() {
                    connectionWithGoogle();
                }
            }
        ],       
    }
];

function connectionWithGoogle() {
    mainWindow.loadURL('http://localhost:3002/');
}

if(process.platform === "darwin") {
    templateMenu.unshift({
        label: app.getName()
    })
}