import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { 
  CircularProgress, Button, Typography,
  Box, IconButton, Dialog, DialogContent,
  Grid, Tooltip,
  DialogActions,
} from '@material-ui/core';
import { 
  Delete, PanTool, ExitToApp, AccountCircle, Face,
} from "@material-ui/icons";
import CardBox from "@material-ui/core/Card";

let socket:any;

const delay = () => new Promise(async(callback:any) => {
  console.log("delaying")
  let hi = setTimeout(()=>{
    callback();
    clearTimeout(hi);
  }, 500);
});

const checkDecrease = (buff:string) => {
  if(buff === "thorns") return true;
  else return false;
}

const damageCalc = ({ actions, buff, strength, vulnerable }:any) => {
  let damage = 0;
  for(const i in actions) {
    if(actions[i].el === "hp") damage += actions[i].value + strength;
  }
  if(buff) damage *= 1.3;
  if(vulnerable) damage *= 1.5;
  return Math.ceil(damage);
}

const curses:any = {
  "Broken Sword": { name: "Broken Sword", unit: "attack", cost: 1, actions: [{ action: "damage", el: "hp", value: 1 }] },
  "Pointoresu": { name: "Pointoresu", unit: "skill", cost: 1, curse: [], actions: [] },
  "Burn": { name: "Burn", unit: "skill", cost: 1, curse: [{ action: "damage", el: "hp", value: 4, curse: true }], actions: [] },
  "Deadly Poison": { name: "Deadly Poison", unit: "skill", cost: 2, curse: [{ action: "damage", el: "hp", value: 10, curse: true }], actions: [] },

  "Omega": { name: "Omega", unit: "attack", cost: 1, actions: [{ action: "damage", el: "hp", value: 35 }] },
  "Goblin": { name: "Goblin", unit: "minion", cost: 2, hp: 14, maxHp: 14, block: 0, actions: [{ action: "damage", el: "hp", value: 8 }], buff: {}, debuff: {} },
}

const fieldColor = (tribe:string, turn:string) => {
  if(!tribe) return "inherit";
  if(tribe === "Water" && turn) return "rgba(180,180,255, 0.5)";
  else if(tribe === "Water") return "rgba(220,220,255, 0.5)";
  else if(tribe === "Fire" && turn) return "rgba(255,180,180, 0.5)";
  else return "rgba(255,220,220, 0.5)";
}

const times = (time:string) => {
  if(time === "Dawn") return { next: "Morning", color: "white", backgroundColor: "gray", status: "Neutral" }
  else if(time === "Morning") return { next: "Noon", color: "black", backgroundColor: "white", status: "Fire: Damage +30%\nWater: Block +30%" }
  else if(time === "Noon") return { next: "Dusk", color: "black", backgroundColor: "white", status: "Fire: Damage +30%\nWater: Block +30%" }
  else if(time === "Dusk") return { next: "Night", color: "white", backgroundColor: "gray", status: "Neutral" }
  else if(time === "Night") return { next: "Midnight", color: "white", backgroundColor: "black", status: "Water: Damage +30%\nFire: Block +30%" }
  else return { next: "Dawn", color: "white", backgroundColor: "black", status: "Water: Damage +30%\nFire: Block +30%" }
}

const Card = ({ card, targeted, disabled, info }:any) => {
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
      background: targeted ? "rgb(255,255,200)" : disabled ? "rgb(100,100,100)" : card.unit === "hero" ? "white" : card.unit === "minion" ? "rgb(245,245,245)" : card.unit === "curse" || card.unit === "debuff" ? "rgb(255,230,255)" :
      card.unit === "power" ? "rgb(220,220,255)" : card.unit === "skill" ? "rgb(220,255,220)" : "rgb(255,220,220)",
      cursor: targeted ? "pointer" : "inherit",
      minHeight: "215px",
      outline: card.debuff === 1 ? "solid 3px red" : card.debuff === 2 ? "solid 3px rgb(245,0,255)" : card.debuff === 3 ? "solid 3px orange" : "none",
      padding: "2px"
    }}>
      <div>
        <Tooltip title={<Typography>{card.name}</Typography>}>
          <Typography noWrap style={{ fontSize: "80%", fontWeight: "bold" }}>
            {card.cost !== undefined ? (
              <b style={{ backgroundColor: "rgb(50,50,255)", color: "white", borderRadius: "50%", padding: "2px 6px" }}>
                {card.cost === -1 ? "X" : card.cost}
              </b>
            ) : <Face style={{ color: "orange" }} />} {card.name}
          </Typography>
        </Tooltip>
        <div style={{ textAlign: "center", height: "70px", padding: "auto", margin: "5px auto" }}>
        {card.img ? (
          <img alt="cardpic" src={card.img} className="compact-image2" />
        ) : (
          <AccountCircle style={{ fontSize: "70px", color: "rgb(150,150,150)" }} />
        )}
        </div>
        {card.hp ? <Typography style={{ marginBottom: "2px", backgroundColor: "red", color: "white", fontWeight: "bold" }}>{card.hp}</Typography> : null}
        {card.taunt ? <p className="cardtext" style={{ background: "rgb(100,100,100)" }}>Taunt</p> : null}
        {card.unit === "minion" ? (
          <>
            <p style={{ margin: 0 }}>Minion Action:</p>
            {card.actions.map((action:any,key:number)=>(
              <Typography key={key} style={{ fontWeight: "bold" }}>
                {action.action === "curse" ? 
                `Curse: ` : ""} {action.el === "hp" ? `${getDamage(action.value)} damage` :
                action.action === "block" ? `${getBlock(action.value)} ${action.el === "block" ? "block" : "tough"}` :
                `${action.multiply ? "x" : ""}${action.value} ${action.el}`} {action.aoe ? "to all" : ""}
              </Typography>
            ))}
          </>
        ) : card.actions ? card.actions.map((action:any,key:number)=>(
          <Typography key={key} style={{ fontWeight: "bold" }}>
            {action.action === "curse" ? 
            `Curse: Add${action.drawPile ? " to draw" : " to discard"}` : ""} {action.el === "hp" ? `${getDamage(action.value)} damage` :
            action.action === "block" ? `${getBlock(action.value)} ${action.el === "block" ? "block" : "tough"}` :
            `${action.multiply ? "x" : ""}${action.value} ${action.el}`} {action.aoe ? "to all" : action.self ? "to itself" : action.minionOnly ? "to a minion" : ""}
          </Typography>
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

const GameCard = ({ card, act, me, click, targeted, info }:any) => {
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

let powers:any = {};
let botPowers:any = {};
let botTurn = false;


export default function BotPlay ({ dec, bot, end }:any) {
  const [field, setField] = useState<any>({
    me: [null, null, null, null, null, null, null, dec.hero, null, null],
    op: [null, null, bot.hero, null, null, null, null, null, null, null],
    shared: [],
    time: "Dawn",
    stage: 0,
  });
  const [op, setOp] = useState<any>({
    deck: bot.cards,
    extra: bot.extra,
    hand: [],
    dead: [],
    power: {},
    turn: false,
    attack: false,
    gold: 0,
    energy: 0,
  });
  const [me, setMe] = useState<any>({
    deck: dec.cards,
    extra: dec.extra,
    hand: [],
    dead: [],
    power: {},
    turn: false,
    attack: false,
    gold: 0,
    energy: 0,
  });
  const [shop, setShop] = useState(dec.extra);
  const [selected, setSelected] = useState<any>(null);
  const [showHand, setShowHand] = useState(false);
  const [search, setSearch] = useState<any>(null);
  const [attacking, setAttacking] = useState<any>(null);
  const [attackable, setAttackable] = useState(false);
  const [discarding, setDiscarding] = useState(0);
  const [exhausting, setExhausting] = useState(false);
  const [from, setFrom] = useState(0);
  const [beforeEnd, setBeforeEnd] = useState(false);
  const [tick, setTick] = useState(0);
  const [drawAmount, setDrawAmount] = useState(5);
  const [opDrawAmount, setOpDrawAmount] = useState(5);
  const [firstDraw, setFirstDraw] = useState(true);
  const [firstTurn, setFirstTurn] = useState(false);
  const [filter, setFilter] = useState<any>({ level: "", color: "", symbol: "" });
  const [visited, setVisited] = useState(false);
  const [show, setShow] = useState(false);
  const [shopCards, setShopCards] = useState<any>(null);

  const cardAct = ({ action, person, key, card, attacker }:any) => {
    const prev:any = field;
    const from = !botTurn ? me : op;
    const enemy = !botTurn ? op : me;
    const side = !botTurn ? "me" : "op";
    const hero = !botTurn ? 7 : 2;
    let time = botTurn ? times(field.time).next : field.time;

    if(action.action === "gold") {
      from.gold = from.gold + action.value;
      if(me.turn) setMe(from);
      else setOp(from);
    } else if(action.action === "curse") {
      if(card.buff.negate) {
        prev[person][key].buff.negate -= 1;
      } else {
        for(let i = 0; i < action.value; i ++) {
          if(action.drawPile) enemy.deck.push(curses[action.el]);
          else enemy.dead.push(curses[action.el]);
        }
        if(me.turn) setOp(enemy);
        else setMe(enemy);
      }
    } else if(action.action === "energy") {
      from.energy += action.value;
      if(me.turn) setMe(from);
      else setOp(from);
    } else if(action.action === "buff" || action.action === "debuff") {
      if(!prev[person][key]) return;
      if(card.buff.negate && action.action === "debuff") {
        if(prev[person][key].buff.negate === 1) prev[person][key].buff.negate = 0;
        else prev[person][key].buff.negate -= 1;
      } else {
        if(action.multiply) {
          if(prev[person][key][action.action][action.el]) prev[person][key][action.action][action.el] *= action.value;
        } else {
          if(prev[person][key][action.action][action.el]) prev[person][key][action.action][action.el] += action.value;
          else prev[person][key][action.action][action.el] = action.value;
        }
      }
    } else if(action.action === "block") {
      let v = action.value;
      if(time === "Morning" && from.tribe === "Water") v *= 1.3;
      else if(time === "Night" && from.tribe === "Fire") v *= 1.3;
      if(attacker.unit === "minion") {
        if(attacker.debuff.flail) v *= 0.75;
      } else if(prev[side][hero].debuff && prev[side][hero].debuff.flail) v *= 0.75;
      v = Math.ceil(v);
      prev[side][key][action.el] = (prev[side][key][action.el] || 0) + v;
    } else {
      if(!prev[person][key]) return;
      let v = action.value;

      if(attacker && attacker.unit === "minion") {
        v += prev[side][attacker.key].buff.strength || 0;
        if(prev[side][attacker.key].debuff.weak) v *= 0.75;
      } else if(attacker) {
        v += prev[side][hero].buff.strength || 0;
        if(prev[side][hero].debuff.weak) v *= 0.75;
      }
      if(action.curse) {
        if(card.debuff.scar) v = Math.ceil(v * 2);
      } else {
        if(time === "Midnight" && from.tribe === "Water") v *= 1.3;
        else if(time === "Noon" && from.tribe === "Fire") v *= 1.3;

        if(card.debuff.vulnerable) v *= 1.5;
      }

      v = Math.ceil(v);
      let that = prev[person][key];
      if(that.spBlock) {
        if(that.spBlock >= v) v = 0;
        else v -= that.spBlock;
      }

      if(card.block >= v) that.block -= v;
      else {
        that.hp -= v - that.block;
        that.block = 0;
        if(that.hp <= 0) {
          that.spBlock = 0;
          that.hp = that.maxHp;
          that.debuff = {};
          if(that.defaultBuff) that.buff = { ...that.buff, ...that.defaultBuff };
          if(botTurn) setOp({ ...op, dead: [...op.dead, that] });
          else setMe({ ...me, dead: [...me.dead, that] });
          if(card.unit !== "hero") prev[person][key] = null;
        }
      }
      if(attacker && card.buff.thorns) {
        const newKey = attacker.unit === "minion" ? attacker.key : 7;
        let attacker2:any = prev[attacker.person][newKey];

        if(attacker2.spBlock) {
          if(attacker2.spBlock >= v) v = 0;
          else v -= attacker2.spBlock;
        }

        if(attacker2.block >= card.buff.thorns) attacker2.block -= card.buff.thorns;
        else {
          attacker2.hp -= card.buff.thorns - attacker2.block;
          attacker2.block = 0;
          if(attacker2.hp <= 0) {
            attacker2.spBlock = 0;
            attacker2.debuff = {};
            attacker2.hp = attacker2.maxHp;
            if(attacker2.defaultBuff) attacker2.buff = { ...attacker2.buff, ...attacker2.defaultBuff };
            if(botTurn) setOp({ ...op, dead: [...op.dead, attacker2] });
            else setMe({ ...me, dead: [...me.dead, attacker2] });
            if(attacker2.unit !== "hero") prev[person][key] = null;
          }
        }
      }
    }

    setSearch(null);
    setField((pre:any)=>({
      ...pre,
      op: pre.op,
      me: pre.me,
    }));
    setTick(tick + 1);
  }

  const cardMove = ({ action, person, key, card }:any) => {
    const prev:any = field;
    switch (action) {
      case "move": {
        setSelected(card);
        prev[person][key] = null;
        break;
      }
      case "take": {
        setMe({ ...me, hand: [...me.hand, card] });
        prev[person][key] = null;
        break;
      }
      case "shuffle": {
        setMe({ ...me, deck: [...me.deck, card] });
        prev.me[key] = null;
        break;
      }
      case "discard": {
        if(person === "me") setMe({ ...me, dead: [...me.dead, card] });
        else {
          console.log("removing...")
          op.dead.push(card);
          setOp(op);
        }
        let before = field;
        before[person][key] = null;
        setField((prev:any)=>({
          ...prev,
          [person]: before[person],
        }));
        break;
      }
      case "exhaust": {
        prev[person][key] = null;
        setField(prev);
        break;
      }
    }
    setTick(tick + 1);
  }

  const draw = (num:number) => {
    console.log("drawn")
    const prev:any = botTurn ? op : me;
    let d = [...prev.deck];
    let dead = [...prev.dead];
    for(let i = 0; i < num; i ++) {
      if(prev.hand.length > 9 || (d.length === 0 && dead.length === 0)) break;
      if(d.length === 0) {
        d = dead;
        dead = [];
      }
      const ran = Math.floor(Math.random() * (d.length - 1));
      const c = d.splice(ran, 1);
      prev.hand.push(c[0]);
    }
    prev.deck = d;
    prev.dead = dead;
    prev.drawable = false;
    prev.hand = prev.hand.sort((a:any,b:any)=>b.gold || 0 - a.gold || 0);
    console.log(prev.hand);
    if(!botTurn) {
      setMe(prev);
      setShowHand(true);
      setTick(tick + 1);
    } else {
      setOp(prev);
      setTick(tick + 1);
    }
  }

  const checkAoe = ({ attacker, person, key, card, action }:any) => {
    if(card.unit === "hero" && action.minionOnly) return;
    if(action.aoe) {
      for(const x in field[person]) {
        if(field[person][x]) {
          cardAct({ card, person, key: Number(x), action, attacker });
        }
      }
    } else cardAct({ card, person, key, action, attacker });
  };

  const cardClick = ({ card, key, person, attacking }:any) => {
    if(attacking) {
      const combat = () => {
        for(const i in attacking.actions) {
          checkAoe({ attacker: attacking, person, key, card, action: attacking.actions[i] });
        }
      }
      setAttackable(false);
      let pow = me.turn ? powers : botPowers
      if(pow.repeat !== -1) combat();
      if(pow.repeat) {
        for(let i = 0; i < pow.repeat; i ++) combat();
        pow.repeat = 0;
      }

      if(attacking.sp) {
        for(const i in attacking.sp) {
          if(i === "draw") {
            draw(attacking.sp[i]);
          } else if(i === "Change Damage") {
            attacking.actions[0].value += attacking.sp[i];
          } else if(i === "Draw amount") {
            setDrawAmount(drawAmount + attacking.sp[i]);
          } else if(i === "Discard" || i === "Exhaust") {
            if(botTurn) {

            } else {
              setDiscarding(attacking.sp[i]);
              if(i === "Discard") setExhausting(false);
              else setExhausting(true);
              setShowHand(true);
            }
          } else if(i === "Shuffle Copy") {
            const prev = me;
            prev.dead.push(attacking);
            setMe(prev);
          } else if(i === "Shuffle") {
            const prev = me;
            prev.dead.push(curses[attacking.sp[i]]);
            setMe(prev);
          } else if(i === "Repeat next card") {
            if(me.turn) powers.repeat = 1;
            else botPowers.repeat = 1;
          } else if(i === "Block on play") {
            if(me.turn) powers.blockOnPlay = attacking.sp[i];
            else botPowers.blockOnPlay = 1;
          }
        }
      }
      if(!botTurn) cardMove({ card: attacking, person: attacking.person, key: attacking.key, action: attacking.unit === "power" || attacking.curse ? "exhaust" : "discard" });
      setAttacking(null);
    }
  }

  const botMove = () => {
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
          let time = times(field.time).next;
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
        cardClick({ card: field[target][targetKey], person: target, key: targetKey, attacking: { ...field.op[7], key: 7, person: "op" } });
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
          let time = times(field.time).next;
          if(field.op[2].hp < 20) stance = "defense";
          else if(field.op[2].hp < 30) stance = "normal";
          else if(field.me[7].hp + field.me[7].block + (field.me[7].spBlock || 0) < 30) stance = "attack";
          else if((field.time === "Midnight" && op.tribe === "Water") || (field.time === "Noon" && op.tribe === "Fire")) stance = "attack";
          else if((time === "Morning" && op.tribe === "Water") || (time === "Night" && op.tribe === "Fire")) stance = "defense";
          let zero = true;
          console.log(op.hand)
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
            console.log("bought");
          }
        }
        const prev = op;
        prev.dead = [...prev.dead, ...bought];
        prev.extra = ex;
        prev.gold = gold;
        setOp(prev);
        setTick(tick + 1);
        step = 4;
      }
    }, 1000)
  }

  const endTurn = (person:string) => {
    console.log("ended turn")
    let energyGain = 3;
    let gold = (person === "op" ? me.gold : op.gold) + 3 + field.stage;
    
    const prev = {...field};
    const summons = [];
    let hero = person === "me" ? 7 : 2;
    let enemy = person === "me" ? "op" : "me";
    let enemyHero = person === "me" ? 2 : 7;
    for(const i in prev[person]) {
      const char = prev[person][i]
      if(char && char.unit === "minion") {
        const actions = char.actions;
        for(const x in actions) {
          const action = char.actions[x];
          if(action.action === "summon") {
            for(let i = 0; i < action.value; i ++) summons.push(curses[action.el]);
          } else if(action.action === "energy") {
          } else if(action.action === "block" || action.action === "buff") {
            checkAoe({ attacker: { ...prev[person][i], person, key: Number(i) }, card: person === "me" ? prev.me[7] : prev.op[2], 
            person, key: action.self ? Number(i) : person === "me" ? 7 : 2, action });
          } else {
            let taunted = false;
            for(const x in prev[enemy]) {
              if(prev[enemy][x] && prev[enemy][x].taunt) {
                taunted = true;
                checkAoe({ attacker: { ...prev[person][i], person, key: Number(i) }, card: prev[enemy][x], person: enemy, key: Number(x), action });
              }
            }
            if(!taunted) checkAoe({ 
              attacker: { ...prev[person][i], person, key: Number(i) }, card: prev[enemy][enemyHero], person: enemy, key: enemyHero, action 
            });
          }
        }
      } 
    }
    for(const x in summons) {
      for(const i in prev[person]) {
        if(!prev[person][i] && Number(i) !== (person === "me" ? 2 : 7)) {
          prev[person][i] = summons[x];
          break;
        }
      }
    }
    const char = person === "me" ? me : op;
    for(const i in char.hand) {
      if(char.hand[i].curse) {
        for(const x in char.hand[i].curse) {
          checkAoe({ attacker: null, card: prev[person][hero], person, key: hero, action: char.hand[i].curse[x] });
        }
      }
    }
    for(const x in prev[person]) {
      if(prev[person][x]) {
        if(prev[person][x].debuff) {
          for(const i in prev[person][x].debuff) {
            if(prev[person][x].debuff[i]) prev[person][x].debuff[i] -= 1;
          }
        }
      }
    }
    for(const i in prev[enemy]) {
      if(prev[enemy][i]) {
        const en = prev[enemy][i];
        en.block = 0;
        en.spBlock = 0;
        if(en.buff) {
          for(const x in en.buff) {
            if(en.buff[x] && checkDecrease(x)) en.buff[x] -= 1;
          }
        };
        for(const x in en.actions) {
          if(en.actions[x].action === "energy") energyGain += en.actions[x].value;
          else if(en.actions[x].action === "gold") gold += en.actions[x].value;
        }
      };
    }
    
    prev.op[7] = null;
    setField((pre:any)=>{
      return { ...prev, time: times(pre.time).next, stage: (pre.time === "Dawn" || pre.time === "Dusk") && pre.stage < 2 ? pre.stage + 1 : pre.stage }
    });

    console.log("endingturn:" + person)
    if(person === "me") {
      const newHand = me.hand.filter((a:any)=>(a.curse || (a.sp && a.sp.Retain)));
      const newDead = [...me.dead, ...me.hand.filter((a:any)=>!a.curse && !(a.sp && a.sp.Retain)) ];
      me.hand = newHand;
      me.dead = newDead;
      me.turn = false;
      setMe(me);
      op.energy = energyGain;
      op.gold = gold;
      setOp(op);
    } else {
      setOp((prev:any)=>{
        return ({ 
          ...prev, dead: [...prev.dead, ...prev.hand.filter((a:any)=>!a.curse && !(a.sp && a.sp.Retain))], 
          hand: prev.hand.filter((a:any)=>(a.curse || (a.sp && a.sp.Retain))),
        });
      })
      setMe({ ...me, turn: true, energy: energyGain, gold, drawable: true });
    }
    setFirstTurn(false);
    setVisited(false);
    setShopCards(null);
    botTurn = !botTurn;
    if(botTurn) botMove();
  }

  return (
    <div>
    <Grid container spacing={3} style={{ width: "100%" }} className="field">
      <Grid xs={2} item>
        <Grid item>
            <div className={op.deck.length ? "board m-auto" : "board empty m-auto"}>
              <Typography>Deck: {op.deck.length}</Typography>
            </div>
        </Grid>
        <Grid item style={{ paddingTop: "20px", paddingBottom: "20px" }}>
          <div style={{ 
            padding: "20px", 
            backgroundColor: times(field.time).backgroundColor,
            color: times(field.time).color, borderRadius: "10px" 
          }}>
          <h3 style={{ fontWeight: "bold" }}>{field.time}</h3>
          <p style={{ fontWeight: "bold", fontSize: "14px", whiteSpace: "pre-line" }}>{times(field.time).status}</p>
          <h3 style={{ fontWeight: "bold", marginTop: "15px" }}>Stage: {field.stage + 1}</h3>
          <p style={{ fontWeight: "bold", fontSize: "16px", whiteSpace: "pre-line", margin: 0 }}>
            Draw: {5 + (field.stage === 2 ? 1 : 0)} {"\nGold:"} {3 + field.stage}
          </p>
          </div>
        </Grid>
        <Grid item>
          <div className={me.dead.length ? "board m-auto" : "board empty m-auto"}>
            Discard Pile<br/>
            Remain: {me.dead.length}<br/>
            {me.dead.length ? (
              <>
              <Button
              size="small"
              variant="contained"
              onClick={()=>{
                const ran = Math.floor(Math.random() * (me.dead.length - 1));
                const d = [...me.dead];
                const c = d.splice(ran, 1);
                setMe({ ...me, dead: d, hand: [...me.hand, c[0]] });
                setTick(tick + 1);
              }}
              >Draw</Button>
              <Button variant="contained" size="small"
              onClick={()=>{
                setSearch(me.dead);
                setFrom(4);
                setShow(true);
              }}
              >Search</Button>
            </>
            ) : null}
          </div>
        </Grid>
        {attacking || selected || discarding ? null : me.turn && shopCards ? (
          <Button
          className="mt-2"
          variant="contained"
          color="primary"
          onClick={()=>endTurn("me")}>End turn</Button>
        ) : null}
      </Grid>
      <Grid xs={8} item>
        <Grid container>
            <Box display="flex" style={{ overflowX: "auto", justifyContent: "center", width: "100%", height: "18px" }}>
            {op.hand.map((card:any,key:number)=>(
              <div className="board short" key={key} />
            ))}
            </Box>
          <Grid xs={12} item>
            <Box display="flex" flexWrap="wrap" style={{ 
              width: "780px", margin: "auto",
              backgroundColor: fieldColor(op.tribe, op.turn),
              outline: !me.turn ? `solid 5px rgb(0,150,0)` : "none" 
            }}>
            {field.op.map((card:any,key:number)=>(
                card ? (
                  <GameCard card={card} key={key} me={false}
                  targeted={attackable && (
                    attacking.unit === "debuff" || (attacking.unit === "attack" && (card.taunt || field.op.filter((a:any)=>(a && a.taunt)).length === 0))
                  )}
                  act={(action:string)=>{
                    cardMove({ card, person: "op", key, action });
                  }}
                  click={()=> cardClick({ key, card, person: "op", attacking })}
                  info={{ ...field.op[2].buff, ...field.op[2].debuff, time: field.time, tribe: op.tribe }}
                  />
                ) : (
                  <Box className="board" key={key} 
                  style={{ 
                    backgroundColor: "inherit", cursor: selected ? "pointer" : "inherit", width: "145px",
                  }} 
                  onClick={()=>{
                    if(selected) {
                      setField((prev:any)=>{
                        prev.op[key] = selected;
                        return prev;
                      })
                      setSelected(null);
                      setTick(tick + 1);
                    }
                  }}
                  />
                )
              ))}
            </Box>
            <div style={{ height: "5px", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "30%" }} />
            <Box display="flex" flexWrap="wrap"
            style={{ 
              width: "780px", margin: "auto",
              backgroundColor: fieldColor(me.tribe, me.turn),
              outline: me.turn ? `solid 5px rgb(0,150,0)` : "none",
            }}>
              {field.me.map((card:any,key:number)=>(
                card ? (
                  <GameCard key={key} card={card} me={true}
                  act={(action:string)=> cardMove({ card, person: "me", key, action })}
                  targeted={attacking && attacking.id === card.id ? false : attackable && (attacking.unit === "skill" || attacking.unit === "power")}
                  click={()=> cardClick({ key, card, person: "me", attacking })}
                  info={{ ...field.me[7].buff, ...field.me[7].debuff, time: field.time, tribe: me.tribe }}
                  />
                ) : (
                  <Box className="board" key={key} 
                  style={{ 
                    backgroundColor: selected && (selected.unit === "minion" && key !== 2) ? "rgb(255,255,170)" : 
                    selected && (selected.unit !== "minion" && key === 2) ? "rgb(255,255,170)" :
                    key === 2 && me.turn ? "rgb(255,240,255)" :
                    "inherit",
                    pointerEvents: selected && (selected.unit === "minion" && key !== 2) ? "all" : selected && (selected.unit !== "minion" && key === 2) ? "all" : "none",
                    cursor: selected ? "pointer" : "inherit", width: "145px" 
                  }} 
                  onClick={()=>{
                    if(selected) {
                      if(selected.unit !== "minion") {
                        setAttacking({ ...selected, key, person: "me" });
                        setAttackable(true);
                      }
                      const prev:any = { ...field };
                      if(selected.cost === -1) {
                        powers.repeat = me.energy - 1;
                      }
                      if(powers.blockOnPlay) {
                        prev.me[7].block += powers.blockOnPlay;
                      }
                      prev.me[key] = selected;
                      setMe({ ...me, energy: selected.cost === - 1 ? 0 : me.energy -= selected.cost });
                      setField(prev);
                      setSelected(null);
                      setTick(tick + 1);
                    }
                  }}
                  />
                )
              ))}
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={2} item>
        <Grid item>
        <Grid style={{ display: "flex" }}>
        <div style={{ background: "rgb(50,50,255)", color: "white", padding: "3px 10px", fontWeight: "bolder",  borderRadius: "20px", margin: "10px" }}>
          {op.energy}
        </div>
        <div style={{ background: "orange", color: "white", padding: "3px 10px", fontWeight: "bolder",  borderRadius: "20px", margin: "10px" }}>{op.gold}</div>
        </Grid>
            <div className={op.dead.length ? "board m-auto" : "board empty m-auto"}>
              Gravayard<br/>
              Remain: {op.dead.length}
            </div>
          </Grid>
          <Grid item className="mt-3 mb-3">
            <div className={"board shop m-auto"}>
              <Typography>Shop</Typography>
              <p>Remain: {shop.length}</p>
              {me.turn ? <Button variant="contained" color={shopCards ? "primary" : "secondary"}
              onClick={()=>{
                setFrom(1);
                if(!shopCards) {
                  const s = [...shop].filter((a:any)=>a.gold <= 4 + field.stage);
                  const selection = [];
                  for(let i = 0; i < 5; i ++) {
                    if(s.length === 0) break;
                    const ran = Math.floor(Math.random() * (s.length - 1));
                    const c = s.splice(ran, 1);
                    selection.push(c[0]);
                    if(s.length === 0) break;
                  }
                  setShopCards(selection);
                  setSearch(selection);
                } else setSearch(shopCards);
                setShow(true);
              }}
              >Visit</Button> : null}
            </div>
          </Grid>
          <Grid item>
            <div style={{ width: "100px", margin: "20px auto" }}>
            <div style={{ background: "rgb(50,50,255)", color: "white", padding: "3px 10px", fontWeight: "bolder", fontSize: "150%", borderRadius: "20px", marginBottom: "10px" }}>
              {me.energy}
            </div>
            <div style={{ background: "orange", color: "white", padding: "3px 10px", fontWeight: "bolder", fontSize: "150%", borderRadius: "20px" }}>{me.gold}</div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
            {Object.keys(me.power).map((key:string)=>(
              <div className="cardtext">{key}: {me.power[key]}</div>
            ))}
            </div>
            </div>
            <div className={me.deck.length ? "board m-auto" : "board empty m-auto"}>
              <Typography>Deck: {me.deck.length}</Typography>
                {me.drawable ? (
                  <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={()=>{
                    draw(drawAmount + (field.stage === 2 ? 1 : 0));
                    if(firstDraw) {
                      setFirstDraw(false);
                      //setDrawAmount(3);
                    }
                  }}
                  >Draw</Button>
                ) : null}
                <br/><br/>
              {me.deck.length ? (
              <>
                <Button variant="contained" size="small"
                onClick={()=>{
                  setSearch(me.deck);
                  setShow(true);
                  setFrom(0);
                  setFilter({ level: "", color: "", symbol: "" });
                }}
                >Search</Button>
              </>
              ) : null}
            </div>
          </Grid>
          {!me.turn && !op.turn ? (
            <Button
            className="mt-2"
            variant="contained"
            onClick={()=>{
              setFirstTurn(true);
              setDrawAmount(5);
              setMe({ ...me, tribe: "Fire", turn: true, energy: 2, gold: 3, drawable: true });
              setOp({ ...op, tribe: "Water", turn: false });
              setTick(tick + 1);
            }}
            >Start</Button>
          ) : (<Button
            className="mt-3"
            variant="contained"
            color="default"
            onClick={()=>setBeforeEnd(true)}
            >Quit</Button>
          )}
      </Grid>
      <div style={{ height: "70px",  width: "100%" }} 
      onMouseEnter={()=>{
        if(!attacking && !selected) setShowHand(true);
      }}
      />
      {showHand ? (
        <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 1, 
        background: discarding ? "rgb(50,0,0)" : "rgba(255,255,255,0.3)" }}
        onMouseLeave={()=>{
          if(!discarding) setShowHand(false);
        }}>
          <Box display="flex" style={{ overflowX: "auto", justifyContent: "center" }}>
            {me.hand.map((card:any,key:number)=>(
              <div key={key}>
                {!discarding ? (
                  <>
                  <IconButton
                  size="small"  
                  onClick={()=>{
                    const h = [...me.hand];
                    h.splice(key, 1);
                    setMe({ ...me, hand: h, deck: [...me.deck, card] });
                    setTick(tick + 1);
                  }}
                  ><ExitToApp /></IconButton>
                  <IconButton
                  size="small"
                  onClick={()=>{
                    const h = [...me.hand];
                    h.splice(key, 1);
                    setMe({ ...me, dead: [...me.dead, card], hand: h });
                    setTick(tick + 1);
                  }}
                  ><Delete /></IconButton>
                  </>
                ) : null}
                <div
                style={{ cursor: "pointer", 
                pointerEvents: op.turn || (firstTurn && (card.unit === "attack" || card.unit === "minion")) || (me.energy < card.cost && !discarding) ? "none" : "all", }}
                onClick={()=>{
                  if(discarding) {
                    const h = [...me.hand];
                    h.splice(key, 1);
                    if(!exhausting) setMe({ ...me, dead: [...me.dead, card], hand: h });
                    else setMe({ ...me, hand: h });
                    setTick(tick + 1);

                    setDiscarding(h.length ? discarding - 1 : 0);
                  } else {
                    const h = [...me.hand];
                    h.splice(key, 1);
                    setMe({ ...me, hand: h });
                    setSelected({ ...card });
                    setTick(tick + 1);
                    setShowHand(false);
                  }
                }}>
                <Card 
                card={card} 
                disabled={op.turn || (firstTurn && (card.unit === "attack" || card.unit === "minion")) || (me.energy < card.cost && !discarding)} 
                info={{ ...field.me[7].buff, ...field.me[7].debuff, time: field.time, tribe: me.tribe }}
                />
                </div>
              </div>
            ))}
            </Box>
        </div>
      ) : null}
      <Dialog maxWidth="sm" fullWidth open={beforeEnd} onClose={()=>setBeforeEnd(false)}>
        <DialogContent style={{ backgroundColor: "rgb(240,240,240)" }}>
          <Typography>Are you sure to end?</Typography>
          <Button></Button>
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="contained" color="secondary"
          onClick={end}
          >END</Button>
        </DialogActions>
      </Dialog>
      {search ? (
        <Dialog maxWidth="md" fullWidth open={show} onClose={()=>setShow(false)}>
          <DialogContent style={{ backgroundColor: "rgb(240,240,240)", textAlign: "center" }}>
            {/* <Filter filter={filter} setFilter={(fil:any)=>setFilter(fil)} /> */}
            <Typography variant="h4" style={{ marginBottom: 10 }}>{from === 1 ? "SHOP" : from === 0 ? "Draw Pile" : "Discard Pile" }</Typography>
            <Box display="flex" flexWrap="wrap" style={{ width: "100%", margin: "auto", justifyContent: "space-between" }}>
              {search.map((card:any,key:number)=>(
                <div key={key}>
                  <div style={{ cursor: "pointer" }} onClick={()=>{
                    if(from === 1) {
                      const prev = me;
                      prev.dead.push(card);
                      const sho = [...shop];
                      prev.gold -= (card.gold || 0);
                      setShop(sho.filter((a:any)=>a.id !== card.id));
                      setShopCards(shopCards.filter((a:any)=>a.id !== card.id))
                      setMe(prev);
                      setSearch(null);
                      setVisited(true);
                    }
                  }}>
                  <Card card={card} disabled={card.gold > me.gold} />
                  {from === 1 ? (
                  <div style={{ padding: "0px 20px" }}>
                    <Typography variant="h5" style={{ backgroundColor: "orange", color: "white", fontWeight: "bold", borderRadius: "10px", textAlign: "center" }}>
                      {card.gold}
                    </Typography>
                  </div>
                  ) : null}
                  </div>
                  {from !== 1 ? (
                    <div style={{ textAlign: "center" }}>
                      {from !== 3 ? (
                        <Button
                        size="small"
                        variant="contained"
                        onClick={()=>{
                          if(from === 0) {
                            const d = [...me.deck];
                            d.splice(key, 1)
                            setMe({ ...me, hand: [...me.hand, { ...card }], deck: d });
                          } else if(from === 1) {
                            const d = [...me.extra];
                            d.splice(key, 1)
                            setMe({ ...me, hand: [...me.hand, { ...card }], extra: d });
                          } else if(from === 4) {
                            const d = [...me.dead];
                            d.splice(key, 1)
                            setMe({ ...me, hand: [...me.hand, { ...card }], dead: d });
                          } else setMe({ ...me, hand: [...me.hand, { ...card }] });
                          setTick(tick + 1);
                          setSearch(null);
                        }}
                        >hand</Button>
                      ) : null}
                      <Button
                      size="small"
                      variant="contained"
                      onClick={()=>{
                        if(from === 0) {
                          const d = [...me.deck];
                          d.splice(key, 1)
                          setMe({ ...me, deck: d });
                        } else if(from === 1) {
                          const d = [...me.extra];
                          d.splice(key, 1)
                          setMe({ ...me, extra: d });
                        } else if(from === 3) {
                          const d = [...field.shared];
                          d.splice(key, 1);
                          setField({ ...field, shared: d });
                        } else if(from === 4) {
                          const d = [...me.dead];
                          d.splice(key, 1)
                          setMe({ ...me, dead: d });
                        }
                        setSelected({ ...card });
                        setSearch(null);
                        setTick(tick + 1);
                      }}
                      >field</Button>
                      </div>
                  ) : null}
                </div>
              ))}
            </Box>
            <Button
            style={{ marginTop: 20, textAlign: "center" }}
            variant="contained"
            size="large"
            color="primary"
            onClick={()=>setShow(false)}
            >SKIP</Button>
          </DialogContent>
        </Dialog>
      ) : null}
    </Grid>
    </div>
  )
}