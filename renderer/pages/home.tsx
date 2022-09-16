import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { ipcRenderer } from "electron";
import Head from "next/head";
import React, { useState } from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

function Home() {
  const [open, setOpen] = useState(false);
  const clickServer = () => {
    if (!open) ipcRenderer.send("startServer");
    else ipcRenderer.send("closeServer");
    setOpen(!open);
  };
  const clickMsg = () => {
    ipcRenderer.send("sendMsg");
  };
  const clickStopMsg = () => {
    ipcRenderer.send("stopSendMsg");
  };

  const clickDetection = () => {
    ipcRenderer.send("detection");
  };
  const clickRequest = (intentions) => {
    ipcRenderer.send(intentions);
  };
  const clickResphonse = (intentions) => {
    ipcRenderer.send(intentions);
  };

  const clickSendSimulation = () => {
    ipcRenderer.send("sendSimulation");
  };
  const clickSendUdpMsg = ()=>{
    ipcRenderer.send("sendUdpMsg");
  }

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <div>
        <p>ADN Simulator</p>
        <Stack spacing={2}>
          <Item>
            <Button variant="outlined" disabled={open} onClick={clickServer}>
              Server Start
            </Button>
            <Button variant="outlined" disabled={!open} onClick={clickServer}>
              Server Close
            </Button>
          </Item>
          <Item>
            <Button variant="outlined" disabled={!open} onClick={clickMsg}>
              Send Msg
            </Button>
            <Button variant="outlined" disabled={!open} onClick={clickStopMsg}>
              Stop Send Msg
            </Button>
          </Item>
          <Item>
            <Button
              variant="outlined"
              disabled={!open}
              onClick={clickDetection}
            >
              Send Detection
            </Button>
            {/* <Button variant="outlined" disabled={!open} onClick={clickResphonse}>Send Resphonse</Button> */}
            {/* <Button variant="outlined" disabled={!open} onClick={clickRequest}>Send Request</Button> */}
            {/* <Button variant="outlined" disabled={!open} onClick={clickStopMsg}>StopSendMsg</Button> */}
          </Item>
          <Item>
            <Button
              variant="outlined"
              disabled={!open}
              onClick={() => clickRequest("mergintRequest")}
            >
              우합류 요청
            </Button>
            <Button
              variant="outlined"
              disabled={!open}
              onClick={() => clickRequest("interruptRequest")}
            >
              끼어들기 요청
            </Button>
            <Button
              variant="outlined"
              disabled={!open}
              onClick={() => clickRequest("overtakingRequest")}
            >
              추월 요청
            </Button>
            <Button
              variant="outlined"
              disabled={!open}
              onClick={() => clickRequest("concessionRequest")}
            >
              양보 요청
            </Button>
          </Item>
          <Item>
            <Button
              variant="outlined"
              disabled={!open}
              onClick={() => clickRequest("mergintResphonse")}
            >
              우합류 수신
            </Button>
            <Button
              variant="outlined"
              disabled={!open}
              onClick={() => clickRequest("interruptReshponse")}
            >
              끼어들기 수신
            </Button>
            <Button
              variant="outlined"
              disabled={!open}
              onClick={() => clickRequest("overtakingReshponse")}
            >
              추월 수신
            </Button>
            <Button
              variant="outlined"
              disabled={!open}
              onClick={() => clickRequest("concessionResphonse")}
            >
              양보 수신
            </Button>
          </Item>

          <Item>
            <Button
              variant="outlined"
              disabled={!open}
              onClick={() => clickSendSimulation()}
            >
              시뮬레이션 실행
            </Button>
          </Item>
          <Item>
            <Button
             variant="outlined"
             onClick={() => clickSendUdpMsg()}
            >
              Udp 송신
            </Button>
          </Item>
        </Stack>
      </div>
    </React.Fragment>
  );
}

export default Home;
