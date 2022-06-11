import React, { useEffect, useState } from "react";
import { 
  Box, IconButton, Dialog, DialogContent,
  Grid, Tooltip, withStyles,
  DialogActions,
} from '@material-ui/core';
import { 
  Delete, PanTool, ExitToApp, AccountCircle,
} from "@material-ui/icons";
import CardBox from "@material-ui/core/Card";

export const Card = ({ card, targeted, disabled, info }:any) => {
  const getDamage = (damage:number) => {
    if(!info) return damage;
    let d = damage;
    if(card.unit === "minion") {
      d += card.buff.strength || 0;
      if(card.debuff.weak) d *= 0.75;
    } else {
      d += info.strength || 0;
      if(info.weak) d *= 0.75;
    }

    if((info.time === "Noon" && info.tribe === "Fire") || (info.time === "Midnight" && info.tribe === "Water")) return Math.ceil(d * 1.3);
    else return Math.ceil(d);
  }

  const getBlock = (block:number) => {
    if(!info) return block;
    let b = block;
    if(card.unit === "minion") {
      if(card.debuff.flail) b *= 0.75;
    } else {
      if(info.flail) b *= 0.75;
    }

    if((info.time === "Night" && info.tribe === "Fire") || (info.time === "Morning" && info.tribe === "Water")) return Math.ceil(b * 1.3);
    else return Math.ceil(b);
  }

  return (
    <CardBox
    elevation={10}
    style={{ 
      width: "145px", margin: "5px", textAlign: "center",
      background: targeted || card.active ? "rgb(255,255,200)" : disabled ? "rgb(100,100,100)" : card.unit === "hero" ? "white" : card.unit === "minion" ? "rgb(245,245,245)" : card.unit === "curse" || card.unit === "debuff" ? "rgb(255,230,255)" :
      card.unit === "power" ? "rgb(220,220,255)" : card.unit === "skill" ? "rgb(220,255,220)" : "rgb(255,220,220)",
      cursor: targeted ? "pointer" : "inherit",
      minHeight: "215px",
      outline: card.debuff === 1 ? "solid 3px red" : card.debuff === 2 ? "solid 3px rgb(245,0,255)" : card.debuff === 3 ? "solid 3px orange" : "none",
      padding: "2px"
    }}>
      <div>
        <Tooltip title={<h4>{card.name}</h4>}>
          <h4 style={{ fontSize: "80%", fontWeight: "bold", flexWrap: "nowrap" }}>
            {card.cost !== undefined ? (
              <b style={{ backgroundColor: "rgb(50,50,255)", color: "white", borderRadius: "50%", padding: "0px 7px" }}>
                {card.cost === -1 ? "X" : card.cost}
              </b>
            ) : null} {card.name}
          </h4>
        </Tooltip>
        <div className="image-container">
        {card.img ? (
          <img alt="cardpic" src={card.img} className="compact-image2" />
        ) : card.unit === "attack" ? (
          <img alt="cardpic" src={"https://img.joomcdn.net/32fe14430a8c581241b06ce33658a53bf86c68d0_original.jpeg"} className="compact-image2" />
        ) : card.building ? (
          <img alt="cardpic" src={"https://spng.pngfind.com/pngs/s/129-1291830_castle-tower-fortress-castle-old-tower-clip-art.png"} className="compact-image2" />
        ) : card.unit === "minion" ? (
          <img alt="cardpic" src={"https://previews.123rf.com/images/hatza/hatza1211/hatza121100037/16591600-viking-warrior-cartoon.jpg"} className="compact-image2" />
        ) : card.actions && card.actions[0] && card.actions[0].action === "block" ? (
          <img alt="cardpic" src={"https://cdn0.iconfinder.com/data/icons/communication-and-multimedia/48/communication_and_multimedia_flat_icons-10-512.png"} className="compact-image2" />
        ) : card.unit === "skill" ? (
          <img alt="cardpic" src={"https://c8.alamy.com/comp/2AC6X44/cute-cartoon-poison-bottle-drawing-green-magic-potion-in-glass-vial-classic-video-game-item-isolated-vector-clip-art-illustration-2AC6X44.jpg"} className="compact-image2" />
        ): card.unit === "curse" ? (
          <img alt="cardpic" src={"https://cdn.xxl.thumbs.canstockphoto.com/magic-book-icon-icon-cartoon-magic-book-icon-in-icon-in-cartoon-style-isolated-vector-illustration-illustration_csp45478923.jpg"} className="compact-image2" />
        ) : card.unit === "debuff" ? (
          <img alt="cardpic" src={"https://previews.123rf.com/images/lineartestpilot/lineartestpilot1802/lineartestpilot180270021/95739430-cartoon-magic-potion.jpg"} className="compact-image2" />
        ) : card.unit === "power" ? (
          <img alt="cardpic" src={"https://thumbs.dreamstime.com/b/colorful-cartoon-energy-symbol-power-thunder-electricity-themed-vector-illustration-icon-stamp-label-certificate-brochure-gift-141945220.jpg"} className="compact-image2" />
        ) : (
          <AccountCircle style={{ fontSize: "70px", color: "rgb(150,150,150)" }} />
        )}
        </div>
        {card.hp ? <h4 style={{ marginBottom: "2px", backgroundColor: "red", color: "white", fontWeight: "bold" }}>{card.hp}</h4> : null}
        {card.taunt ? <p className="cardtext" style={{ background: "rgb(100,100,100)" }}>Taunt</p> : null}
        {card.unit === "minion" ? (
          <>
            {card.actions.map((action:any,key:number)=>(
              <p key={key} style={{ fontWeight: "bold" }}>
                {action.action === "curse" ? 
                `Curse: Add to discard` : ""} {action.el === "hp" ? `${getDamage(action.value)} damage` :
                action.action === "block" ? `${getBlock(action.value)} ${action.el === "block" ? "block" : "tough"}` :
                `${action.multiply ? "x" : ""}${action.value} ${action.el}`} {action.aoe ? "to all" : ""}
              </p>
            ))}
          </>
        ) : card.actions ? card.actions.map((action:any,key:number)=>(
          <p key={key} style={{ fontWeight: "bold" }}>
            {action.action === "curse" ? 
            `Curse: Add${action.drawPile ? " to draw" : " to discard"}` : ""} {action.el === "hp" ? `${getDamage(action.value)} damage` :
            action.action === "block" ? `${getBlock(action.value)} ${action.el === "block" ? "block" : "tough"}` :
            `${action.multiply ? "x" : ""}${action.value} ${action.el}`} {action.aoe ? "to all" : action.self ? "to itself" : action.minionOnly ? "to a minion" : ""}
          </p>
        )) : null}
        {card.sp ? (
          Object.keys(card.sp).map((key:any)=>{
            const value = card.sp[key];
            return <p key={key} style={{ background: "rgb(0,155,155)" }} className="cardtext">{key} {value}</p>
          })
        ) : null}
        {card.hp ? (
          <div>
            {card.spBlock ? <p style={{ background: "orange" }} className="cardtext">Tough: {card.spBlock}</p> : null}
            {card.block ? <p style={{ background: "rgb(100,100,255)" }} className="cardtext">{card.block}</p> : null}
            {Object.keys(card.buff).map((key:any)=>{
              const value = card.buff[key];
              if(value) return <p key={key} className="cardtext" style={{ background: "rgb(255,100,100)" }}>{key} {value}</p>
              else return null;
            })}
            {Object.keys(card.debuff).map((key:any)=>{
              const value = card.debuff[key];
              if(value) return <p key={key} style={{ background: "rgb(255,50,255)"}} className="cardtext">{key} {value}</p>
              else return null;
            })}
          </div>
        ) : null}
        {card.curse ? (
          card.curse.map((curse:any, key:number)=>(
            <p key={key} style={{ background: "rgb(200,50,200)" }} className="cardtext">{info && info.scar ? Math.round(curse.value * 2) : curse.value} {curse.action} to yourself</p> 
          ))
        ) : null}
      </div>
    </CardBox>
  )
}

export const GameCard = ({ card, act, me, click, targeted, info }:any) => {
  const [show, setShow] = useState(false);

  return (
    <Box 
    style={{ pointerEvents: targeted ? "all" : "none" }}
    onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      <div onClick={click}>
        <Card card={card} targeted={targeted} me={me} info={info} /> 
      </div>
      {show ? (
      <div style={{ position: "absolute", background: "white" }}>
        {me ? (
          <>
          <IconButton
          size="small"
          onClick={()=>{
            act("take");
          }}
          ><PanTool /></IconButton>
          <IconButton
          size="small"
          onClick={()=>{
            act("shuffle");
          }}
          ><ExitToApp /></IconButton>
          <IconButton
          size="small"
          onClick={()=>{
            act("discard");
          }}
          ><Delete /></IconButton>
          </>
        ) : null}
      </div>
      ) : null}
    </Box>
  )
}

export const Effect = ({ effect, show }:any) => {
  const [random, setRandom] = useState({ top: 0, left: 0 })
  useEffect(()=>{
    setRandom({ top: Math.floor(Math.random() * 6 - 3), left: Math.floor(Math.random() * 6 - 3) });
  },[effect])
  return (
    <div 
    style={{ 
      position: "absolute", top: String(effect.top + random.top) + "%" || 0, left: String(effect.left + random.left) + "%" || 0, paddingLeft: "80px",
      pointerEvents: "none", opacity: show ? 0.8 : 0, textAlign: "right", width: "220px",
    }}>
      <div style={{ 
        background: effect.color || "red", color: "white", borderRadius: "20px", padding: "0 5px", fontWeight: "bold", fontSize: "35px",
        float: "left",
      }}>
        {effect.text || ""} {effect.text2 ? <b style={{ fontSize: "60%" }}>{effect.text2}</b> : null}
      </div>
    </div>
  )
}

export const getOpposite = (data:any)=> {
  let result:any = { ...data };
  if(data.top === 0) result.top = 50;
  else result.top = 0;
  if(data.left) {
    result.left = 80 - data.left;
  }
  if(data.person === "me") result.person = "op"
  else result.person = "me"
  return result;
}


export const delay = () => new Promise(async(callback:any) => {
  let hi = setTimeout(()=>{
    callback();
    clearTimeout(hi);
  }, 600);
});

const damageCalc = ({ actions, buff, strength, vulnerable }:any) => {
  let damage = 0;
  for(const i in actions) {
    if(actions[i].el === "hp") damage += actions[i].value + strength;
  }
  if(buff) damage *= 1.3;
  if(vulnerable) damage *= 1.3;
  return Math.ceil(damage);
}

export const botMove = ({
  field, opDrawAmount, op, time, botPowers,
  setOp, setField,
  cardClick, cardMove, draw, endTurn
}:any) => {
  let step = 1;
  let attack = false;
  let remove = false;
  let int = setInterval(()=>{
    if(step === 4) {
      endTurn("op");
      clearInterval(int);
    } else if(step === 1) {
      draw(opDrawAmount + (field.stage === 2 ? 1 : 0));
      step = 2;
    } else if(step == 2 && remove) {
      const attacking = field.op[7];
      cardMove({ card: attacking, person: "op", key: 7, action: attacking.unit === "power" || attacking.curse ? "exhaust" : "discard" });
      remove = false;
    } else if(step === 2 && attack) {
      console.log("card attack")
      let target = "op";
      let targetKey = 2;
      if(field.op[7].unit === "attack" || field.op[7].unit === "debuff" || field.op[7].unit === "curse") {
        target = "me";
        targetKey = 7;
      }
      if(field.op[7].unit === "attack") {
        let highest = -1;
        let buff = false;
        if(time === "Midnight" && op.tribe === "Water") buff = true;
        else if(time === "Noon" && op.tribe === "Fire") buff = true;
        for(const i in field.me) {
          let point = 0;
          const targ = field.me[i];
          if(targ) {
            let damage = damageCalc({ actions: field.op[7].actions, buff, strength: field.op[2].strength || 0, vulnerable: targ.debuff.vulnerable });
            if(targ.taunt) point += 1000;
            if(damage >= (targ.hp + targ.block + (targ.spBlock || 0))) {
              point += 100 + targ.hp;
              if(targ.unit === "hero") point += 300;
            } else {
              if(damage > targ.block + targ.spBlock || 0) point += (100 - (targ.hp + targ.block + targ.spBlock || 0));
            }
            if(point > highest) {
              targetKey = Number(i);
              highest = point;
            }
          }
        }
      }
      cardClick({ card: field[target][targetKey], person: target, key: targetKey, attacker: { ...field.op[7], key: 7, person: "op" } });
      attack = false;
      remove = true;
    } else if(step === 2) {
      if(op.hand.length === 0) {
        step = 3
      } else {
        let used:any = null;
        let usedKey = 0;
        let place = 7;
        let stance = "normal";
        if(field.op[2].hp < 20) stance = "defense";
        else if(field.op[2].hp < 30) stance = "normal";
        else if(field.me[7].hp + field.me[7].block + (field.me[7].spBlock || 0) < 30) stance = "attack";
        else if((time === "Midnight" && op.tribe === "Water") || (time === "Noon" && op.tribe === "Fire")) stance = "attack";
        else if((time === "Morning" && op.tribe === "Water") || (time === "Night" && op.tribe === "Fire")) stance = "defense";
        let zero = true;
        const search = () => {
          console.log(stance);
          for(const x in op.hand) {
            if(zero) {
              if(op.hand[x].cost === 0) {
                attack = true;
                place = 7;
                used = op.hand[x];
                usedKey = Number(x);
                break;
              }
            } else if(op.hand[x].cost <= op.energy) {
              const use = () => {
                if(op.hand[x].unit === "minion") {
                  for(const i in field.op) {
                    if(Number(i) !== 7 && !field.op[i]) {
                      place = Number(i);
                      used = op.hand[x];
                      usedKey = Number(x);
                      break;
                    }
                  }
                  if(used) return;
                } else {
                  attack = true;
                  place = 7;
                  used = op.hand[x];
                  usedKey = Number(x);
                  return;
                }
              }
              if(stance === "defense") {
                if(op.hand[x].unit === "skill" || op.hand[x].taunt) use();
                break;
              } else if(stance === "attack") {
                if(op.hand[x].unit !== "skill") use();
                break;
              } else use();
            }
          }
        }
        search();
        zero = false;
        console.log(used);
        if(!used) search();
        if(!used) {
          stance = "normal";
          search();
        }

        if(used) {
          console.log("card play")
          console.log(used)
          const hand = op.hand;
          hand.splice(Number(usedKey), 1);
          
          setOp({ ...op, hand, energy: op.energy -= used.cost });
          const pre = {...field};
          if(botPowers.blockOnPlay) pre.op[2].block += botPowers.blockOnPlay;
          pre.op[place] = used;
          setField((prev:any)=>({
            ...prev,
            op: pre.op,
          }))
        } else step = 3;
      }
    } else if(step === 3) {
      const s = [...op.extra].filter((a:any)=>a.gold <= 3 + field.stage);
      const selection:any = [];
      const bought:any = [];
      let ex:any = [...op.extra];
      let gold = op.gold;
      for(let i = 0; i < 5; i ++) {
        if(s.length === 0) break;
        const ran = Math.floor(Math.random() * (s.length - 1));
        const c = s.splice(ran, 1);
        selection.push(c[0]);
        if(s.length === 0) break;
      }
      for(const i in selection) {
        if(selection[i].gold <= gold) {
          bought.push(selection[i]);
          ex = ex.filter((a:any)=>a.id !== selection[i].id);
          gold -= selection[i].gold;
          console.log("bought: " + selection[i].gold);
        }
      }
      const prev = op;
      prev.dead = [...prev.dead, ...bought];
      prev.extra = ex;
      prev.gold = gold;
      setOp(prev);
      step = 4;
    }
  }, 1000)
}