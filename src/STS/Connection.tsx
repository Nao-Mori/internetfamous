import React, { useEffect, useState } from "react";
import { 
    Button,
    CircularProgress, Typography,
  } from '@material-ui/core';
import io from "socket.io-client";
import { api } from "../api";
import Game from "./Play2";

let socket:any;

export default function Connection ({ deck, allcards, end, bot }:any) {
    const [started, setStarted] = useState(false);
    const [room, setRoom] = useState<any>(null);
    const [state, setState] = useState(null);
  
    const enter = () => {
      socket = io(api.split("/api")[0]);
      socket.emit('joingame', {}, (res:any) => {
        console.log("joined in lobby")
      })
    //   socket.on("connect_error", (err:any) => {
    //       console.log(err)
    //     console.log(`connect_error due to ${err.message}`);
    //   });
      socket.on('start', (res:any) => {
        if(res) {
          setRoom(res);
          setStarted(true);
        }
      })
      socket.on('delete', (res:any) => {
        console.log("room deleted")
        end();
      })
      socket.on('receive', (res:any) => {
        if(res) {
          setState(res);
        }
      })

    }

    useEffect(()=>{
      if(bot) setStarted(true);
      else enter();
      return (()=>{
        console.log("hi")
        if(!bot) socket.disconnect();
      })
    },[])
  
    return (
      <>
        {started ? (
          <Game
          allcards={allcards}
          dec={deck}
          state={state}
          act={(state:any)=>{
            socket.emit('act', { room, state });
          }}
          start={(state:any)=>{
            socket.emit('ini', { room, state })
          }}
          end={end}
          bot={bot}
          />
      ) : (
        <div>
          <h3>Waiting for an opponent...</h3>
          <CircularProgress />
          <br/>
          <br/>
          <Button size="small" variant="contained" onClick={end}>Cancel</Button>
        </div>
      )}
      </>
    )
}