import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import {
  closeServer,
  sendDetection,
  sendMsg,
  sendRequest,
  sendResphonse,
  sendSimulation,
  startServer,
  stopSendMsg,
} from "./SocketServer";
import sendUdpMsg from "./UdpClient";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();

    ipcMain.on("startServer", (event, res) => startServer());
    ipcMain.on("closeServer", (event, res) => closeServer());
    ipcMain.on("sendMsg", (event, res) => sendMsg());
    ipcMain.on("stopSendMsg", (event, res) => stopSendMsg());
    ipcMain.on("detection", (event, res) => sendDetection());
    ipcMain.on("mergintRequest", (event, res) => sendRequest("mergintRequest"));
    ipcMain.on("interruptRequest", (event, res) =>
      sendRequest("interruptRequest")
    );
    ipcMain.on("overtakingRequest", (event, res) =>
      sendRequest("overtakingRequest")
    );
    ipcMain.on("concessionRequest", (event, res) =>
      sendRequest("concessionRequest")
    );

    ipcMain.on("mergintResphonse", (event, res) =>
      sendResphonse("mergintResphonse")
    );
    ipcMain.on("interruptReshponse", (event, res) =>
      sendResphonse("interruptReshponse")
    );
    ipcMain.on("overtakingReshponse", (event, res) =>
      sendResphonse("overtakingReshponse")
    );
    ipcMain.on("concessionResphonse", (event, res) =>
      sendResphonse("concessionResphonse")
    );

    ipcMain.on("sendSimulation", (event, res) => sendSimulation());

    ipcMain.on("sendUdpMsg", (event, res) => sendUdpMsg());
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
