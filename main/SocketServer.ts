const net = require("net");
import { dialog } from "electron";
import { readFileSync } from "fs";
import path from "path";

const clients = [];
const clientCheck = [];
const connectChecks = [];
const logMsg = [];
const serverFn = (client) => {
  //클라이언트 정보 저장
  clients.push(client);

  console.log("connection clients list : " + clients);
  client.setEncoding("utf8");

  client.on("end", () => {
    client.unref();
    client.end();
    client.destroy();
    let idx = clients.indexOf(client);
    if (idx > -1) clients.splice(idx, 1);
    console.log("end client");
    // clearInterval(connectCheck);
  });

  client.on("error", (err) => {
    client.unref();
    client.end();
    client.destroy();
    let idx = clients.indexOf(client);
    if (idx > -1) clients.splice(idx, 1);
    console.log("error : " + err);
  });

  client.on("connect", () => {
    console.log("connect on!");
  });
  client.setNoDelay();
  // const connectCheck = setInterval(function () {
  //   //5초에 한번씩 보냄
  //   console.log("5 second ");
  //   client.write("welcome to server");
  // }, 5000);
  // connectChecks.push(connectCheck);
};

const tServer = net.createServer(serverFn);

tServer.on("end", (e) => {
  console.log(e);
  console.log("end Server");
});
export function startServer() {
  tServer.listen(8107, function () {
    console.log("TCP Server listening on : " + JSON.stringify(tServer.address()));
  });
}

export function closeServer() {
  clients.forEach((client) => {
    client.end();
    client.destroy();
    let idx = clients.indexOf(client);
    if (idx > -1) clients.splice(idx, 1);
  });
  connectChecks.forEach((connectCheck) => {
    clearInterval(connectCheck);
  });
  tServer.close();
}

export function sendMsg() {
  let time = 0;
  let stamp = 1631240803967.41;
  let delay = 0;
  let text = [];
  clients.forEach((client) => {

    dialog
      .showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "CSV Files", extensions: ["csv"] }],
      })
      .then((results) => {
        if (!results.canceled) {
          let file = path.basename(results.filePaths[0]);
          let dir = path.dirname(results.filePaths[0]);
          readFileSync(dir + "/" + file, "utf-8")
            .split("\n")
            .forEach((array) => {
              array = array.trim();
              if (array === "") return;
              if (!isNaN(Number(array.split(",")[0]))) {
                text.push({ time: Number(array.split(",")[0]), lat: Number(array.split(",")[4]), lon: Number(array.split(",")[3]), heading: Number(array.split(",")[6]) });
              }
            });
        }
        for (let t = 0; t < text.length; t++) {
          const date1 = new Date(text[t].time);
          const date2 = new Date(stamp);
          time = time + (date1.getTime() - date2.getTime());
          stamp = text[t].time;
          delay = delay + (date1.getTime() - date2.getTime());
          if (delay > 20) {
            logMsg.push(setTimeout(() => {
              client.write(`{"type" : "latlon", "lat" : "${text[t].lat}", "lon":  "${text[t].lon}", "heading": "${text[t].heading}"}`);
              
            }, time));
            delay = 0;
          }
        }
      });
    console.log(text.length);
    // readFileSync("../resource/GPS_FOG.csv", "utf-8")
    //   .split("\r\n")
    //   .forEach((array) => {
    //     console.log(array);
    //   });
  });
  // setInterval(() => {
  // client.write("welcome to server");
  //   }, 500);
}
export function stopSendMsg(){ 
  logMsg.forEach((msg)=>{
    clearTimeout(msg);
  })
}

export function sendDetection(){ 
  clients.forEach((client) => {
    client.write(`{"type" : "detection" , "detection" : "true"}`);
  });
}

export function sendResphonse(intentions){
  clients.forEach((client) => {
    client.write(`{"type" : "${intentions}" , "detection" : "true"}`);
  });
} 

export function sendRequest(intentions){ 
  clients.forEach((client) => {
    client.write(`{"type" : "${intentions}" , "detection" : "true"}`);
  });
}

