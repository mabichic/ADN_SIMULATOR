import { dialog } from "electron";
import { readFileSync } from "fs";
import path from "path";
import dgram from "node:dgram";
const port = 63011;
const host = "192.168.10.127";
export default function sendUdpMsg() {
  dialog
    .showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "CSV Files", extensions: ["csv"] }],
    })
    .then((results) => {
      let text = [];
      let delay = 0;
      if (!results.canceled) {
        let file = path.basename(results.filePaths[0]);
        let dir = path.dirname(results.filePaths[0]);
        readFileSync(dir + "/" + file, "utf-8")
          .split("\n")
          .forEach((array) => {
            array = array.trim();
            if (array === "") return;
            let data: Buffer = Buffer.from(array.split(",")[1].trim(), "hex");

            text.push(data);
            // console.log(array.split(",")[1].trim());
          });
      }
      let client = dgram.createSocket("udp4");

      let time = 0;

      for (let t = 0; t < text.length; t++) {
        if (t % 3 === 0) time = time + 100;
        // let msg = Buffer.from(text[t], "utf-8");
        // console.log(msg);
        // client.send(msg, 0, msg.length, port, host, (error, bytes) => {
        //   if (error) console.log(error.message);
        //     // client.close();
        // });

        setTimeout(() => {
          client.send(
            text[t],
            0,
            text[t].length,
            port,
            host,
            (error, bytes) => {
              if (error) console.log(error.message);
            }
          );
        }, time);
      }
    });
}
