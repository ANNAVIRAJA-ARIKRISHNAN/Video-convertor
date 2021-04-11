var app = require("electron").app;
var ipcMain = require("electron").ipcMain;
var fs = require("fs");
const os = require("os");
var { dialog } = require("electron");
var BrowserWindow = require("electron").BrowserWindow;
var mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    resizable: true,
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: __dirname + "/convertor.js",
    },
  });

  mainWindow.loadURL("file://" + __dirname + "/index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

ipcMain.on("open-file-dialog-for-file", (event) => {
  if (os.platform() === "linux" || os.platform() === "win32") {
    showDialog(event, ["openFile"], "selected-file");
  } else {
    showDialog(event, ["OpenFile", "openDirectory"], "selected-file");
  }
});

ipcMain.on("select-dirs", (event) => {
  if (os.platform() === "linux" || os.platform() === "win32") {
    showDialog(event, ["openDirectory"], "select-dirs");
  } else {
    showDialog(event, ["openDirectory"], "select-dirs");
  }
});

function showDialog(event, property, sentNote) {
  dialog
    .showOpenDialog(null, {
      properties: property,
    })
    .then((result) => {
      if (result.filePaths.length > 0) {
        // if (!isDirectoryEmpty(result.filePaths[0]))
        console.log(result.filePaths[0]);
        event.sender.send(sentNote, result.filePaths[0]);
        // else showMsg("Error", "Please select empty directory");
      } else showMsg("Error", "No directory selected");
    })
    .catch((err) => {
      showMsg("Error", err);
    });
}

function showMsg(title, msg) {
  console.log(msg);
}

async function isDirectoryEmpty(filePath) {
  let condition = false;
  await fs.readdir(filePath, (err, files) => {
    if (err) {
      showMsg("Error", err);
    } else {
      condition = files.length > 0 ? true : false;
      //console.log("xxx : " + condition);
    }
  });
  //console.log("condition : " + condition);
  return condition;
}
