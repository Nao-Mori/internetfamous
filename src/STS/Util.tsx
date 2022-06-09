import React from "react";
import { 
    Typography, FormControl, InputLabel, Select, MenuItem, Tooltip, TextField,
} from '@material-ui/core';
import CardBox from "@material-ui/core/Card"
import { Extension, Grade, StarBorder, StarHalf, Stars, TurnedIn, AccountCircle, Face } from "@material-ui/icons";

export const getId = () => {
    let id = ""
    const code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    while (!id) {
        let sub = ""
        for(let i = 0; i < 20; i ++) {
          var x = Math.floor((Math.random() * code.length))
          sub += code.charAt(x);
        }
        id = sub
    }
    return id;
};

const filters = ["", "Minion", "Leader", "Master", "Spell", "Token"];
const symbols = ["A", "B", "C", "D", "E"];

export const Filter = ({ filter, setFilter }:any) => {
  return (
    <>
      <FormControl>
      <InputLabel>Type</InputLabel>
        <Select
        value={filter.level}
        style={{ width: "100px", marginBottom: 5 }}
        label="Type"
        onChange={(e:any)=> {
          if(e.target.value === 4) setFilter({ ...filter, level: e.target.value, color: "", symbol: "" });
          else setFilter({ ...filter, level: e.target.value });
        }}
        >
           <MenuItem value="">All</MenuItem>
          {[1, 2, 3, 4, 5].map((color:number)=>(
            <MenuItem key={color} value={color}>
              {filters[color]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
      <InputLabel>Symbol</InputLabel>
      <Select
      value={filter.symbol}
      style={{ width: "100px", marginBottom: 5 }}
      label="Symbol"
      onChange={(e:any)=>{
        setFilter({ ...filter, symbol: e.target.value });
      }}
      >
        <MenuItem value="">All</MenuItem>
        {symbols.map((color:string)=>(
          <MenuItem key={color} value={color}>
            {color}
          </MenuItem>
        ))}
      </Select>
      </FormControl>
      <TextField
      label="Name"
      value={filter.word} onChange={(e:any)=>{
        setFilter({ ...filter, word: e.target.value })
      }} />
    </>
  )
}