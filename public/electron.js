/** Source: https://github.com/fyears/electron-python-example/ */

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");

const APP_NAME = "ML ExploroVis";
app.setName(APP_NAME);

let APP_PATH;
if (!isDev) APP_PATH = process.resourcesPath;
else APP_PATH = app.getAppPath();

const PY_DIST_FOLDER = "build";
const PY_MODULE = "main";

let pyProc = null;
let pyPort = null;

function getScriptPath() {
  if (isDev) return path.join(APP_PATH, "python", PY_MODULE + ".py");

  if (process.platform === "win32")
    return path.join(
      APP_PATH,
      "python",
      PY_DIST_FOLDER,
      PY_MODULE,
      PY_MODULE + ".exe"
    );

  return path.join(APP_PATH, "python", PY_DIST_FOLDER, PY_MODULE, PY_MODULE);
}

function selectPort() {
  pyPort = 4242;
  return pyPort;
}

function createPyProc() {
  let script = getScriptPath();
  let port = "" + selectPort();
  let options = {
    env: {
      ...process.env,
      DEBUG: isDev,
    },
  };

  function spawn() {
    if (isDev)
      pyProc = require("child_process").spawn("python3", [script, port], {
        ...options,
        stdio: "inherit",
      });
    else pyProc = require("child_process").spawn(script, [port], options);

    // Print the output of the python program
    if (pyProc != null) {
      console.log("child process success on port " + port);
      pyProc.on('exit', () => {
        spawn();
      });
    }
  }
  spawn();
}

function exitPyProc() {
  pyProc.kill();
  pyProc = null;
  pyPort = null;
}

app.on("ready", createPyProc);
app.on("will-quit", exitPyProc);

/** Main Window */

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
    minWidth: 900,
    minHeight: 900,
    title: APP_NAME,
    resizable: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      devTools: isDev,
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
