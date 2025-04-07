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
            nodeIntegration: true,
            contextIsolation: false
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
                label: "Inicio",
                click() {
                    home();
                }
            },
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

function home() {
    mainWindow.loadURL(`${__dirname}/views/configuration.html`);
}

if(process.platform === "darwin") {
    templateMenu.unshift({
        label: app.getName()
    })
}

if(process.env.NODE_ENV !== "production") {
    templateMenu.push({
        label: "DevTools",
        submenu: [
            {
                label: "Show/Hide Dev Tools",
                accelerator: "Ctrl+D",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: "reload",
            }
        ]
    });
}