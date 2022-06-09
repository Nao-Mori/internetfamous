import React, { useEffect, useState } from "react";
import { 
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
      socket.emit('joingame', {}, (res:any) => {
      })

    }

    useEffect(()=>{
      if(bot) setStarted(true);
      else enter();
      return (()=>{
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
          <Typography>Waiting for an opponent...</Typography>
          <CircularProgress />
        </div>
      )}
      </>
    )
}