import React, { useEffect, useState } from "react";
import { 
  Box, IconButton, Dialog, DialogContent,
  Grid, withStyles,
  DialogActions,
} from '@material-ui/core';
import { 
  Delete, ExitToApp,
} from "@material-ui/icons";
import { curses } from "./Cards";
import { Card, GameCard, Effect, botMove, getOpposite, delay } from "./Actions";
import Button2 from "@material-ui/core/Button";

const checkDecrease = (buff:string) => {
  if(buff === "thorns") return true;
  else return false;
}

const fieldColor = (tribe:string, turn:string) => {
  if(!tribe) return "inherit";
  if(tribe === "Water" && turn) return "rgba(180,180,255, 0.7)";
  else if(tribe === "Water") return "rgba(240,240,255, 0.5)";
  else if(tribe === "Fire" && turn) return "rgba(255,180,180, 0.7)";
  else return "rgba(255,240,240, 0.5)";
}

const times = (time:string) => {
  if(time === "Dawn") return { next: "Morning", color: "white", backgroundColor: "gray", status: "Neutral" }
  else if(time === "Morning") return { next: "Noon", color: "black", backgroundColor: "white", status: "Fire: Damage +30%\nWater: Block +30%" }
  else if(time === "Noon") return { next: "Dusk", color: "black", backgroundColor: "white", status: "Fire: Damage +30%\nWater: Block +30%" }
  else if(time === "Dusk") return { next: "Night", color: "white", backgroundColor: "gray", status: "Neutral" }
  else if(time === "Night") return { next: "Midnight", color: "white", backgroundColor: "black", status: "Water: Damage +30%\nFire: Block +30%" }
  else return { next: "Dawn", color: "white", backgroundColor: "black", status: "Water: Damage +30%\nFire: Block +30%" }
}

const baseGold = 2;
let botTurn = false;

const Button = withStyles(() => ({
  root: {
    fontFamily: "inherit",
    fontWeight: "bold"
  },
}))(Button2);

let powers:any = {}
let botPowers:any = {};


export default function Game ({ dec, state, act, start, end, bot }:any) {
  const [field, setField] = useState<any>({
    me: [null, null, null, null, null, null, null, dec.hero, null, null],
    op: [null, null, bot ? bot.hero : null, null, null, null, null, null, null, null],
    shared: [],
    time: "Dawn",
    stage: 0,
    effect: {},
  });
  const [op, setOp] = useState<any>({
    deck: bot ? bot.cards : [],
    extra: bot ? bot.extra : [],
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
  //const [filtered, setFiltered] = useState(false);
  const [from, setFrom] = useState(0);
  const [beforeEnd, setBeforeEnd] = useState(false);
  const [tick, setTick] = useState(0);
  const [drawAmount, setDrawAmount] = useState(5);
  const [firstDraw, setFirstDraw] = useState(true);
  const [firstTurn, setFirstTurn] = useState(false);
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [shopCards, setShopCards] = useState<any>(null);
  const [opDrawAmount, setOpDrawAmount] = useState(5);
  const [ended, setEnded] = useState(false);

  useEffect(()=>{
    console.log("ticked");
    if(bot) {} else if(ready) {
      act({
        op: me,
        me: op,
        field: { me: [...field.op].reverse(), op: [...field.me].reverse(), 
        time: field.time,
        stage: field.stage,
        effect: getOpposite(field.effect),
      },
      });
    } else {
      setReady(true);
      start({
        op: me,
        opField: [...field.me].reverse(),
      });
    }
  },[tick])

  useEffect(()=>{
    if(state) {
      if(state.ini) {
        setField({ ...field, op: state.opField })
      } else {
        setField(state.field);
        setMe(state.me);
      }
      setOp(state.op);
    }
  },[state])


  const cardAct = ({ action, person, key, card, attacker }:any) => {
    const prev:any = field;
    const from = !botTurn ? me : op;
    const enemy = !botTurn ? op : me;
    const side = !botTurn ? "me" : "op";
    const hero = !botTurn ? 7 : 2;
    let time = botTurn ? times(field.time).next : field.time;
    let v = action.value;
    let blocked = false;

    if(action.action === "gold") {
      from.gold = from.gold + action.value;
      if(me.turn) setMe(from);
      else setOp(from);
    } else if(action.action === "curse") {
      if(card.buff.negate) {
        prev[person][key].buff.negate -= 1;
        blocked = true;
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
      if(time === "Morning" && from.tribe === "Water") v *= 1.3;
      else if(time === "Night" && from.tribe === "Fire") v *= 1.3;
      if(attacker.unit === "minion") {
        if(attacker.debuff.flail) v *= 0.75;
      } else if(prev[side][hero].debuff && prev[side][hero].debuff.flail) v *= 0.75;
      v = Math.ceil(v);
      prev[side][key][action.el] = (prev[side][key][action.el] || 0) + v;
    } else {
      if(!prev[person][key]) return;

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

        if(card.debuff.vulnerable) v *= 1.3;
      }

      v = Math.ceil(v);
      let that = prev[person][key];
      if(that.spBlock) {
        if(that.spBlock >= v) v = 0;
        else v -= that.spBlock;
      }

      if(card.block >= v) {
        that.block -= v;
        blocked = true;
      } else {
        that.hp -= v - that.block;
        v -= that.block;
        that.block = 0;
        if(that.hp <= 0) {
          that.spBlock = 0;
          that.hp = that.maxHp;
          that.debuff = {};
          if(that.defaultBuff) that.buff = { ...that.buff, ...that.defaultBuff };
          if(that.unit !== "hero") {
            console.log("died")
            cardMove({ card: that, person, key, action: that.unit === "power" || that.curse ? "exhaust" : "discard" });
          }
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
            if(attacker2.unit !== "hero") {
              console.log("died")
              cardMove({ card: attacker2, person, key, action: attacker2.unit === "power" || attacker2.curse ? "exhaust" : "discard" });
            }
          }
        }
      }
    }

    setSearch(null);
    let top = key > 4 ? 50 : 0;
    let left = key > 4 ? (key - 5) * 20 : key * 20;
    let effect = {
      top, left, text2: action.action !== "damage" && action.action !== "block" ? action.el : "",
      text: blocked ? "Blocked!" : action.action === "damage" ? `-${v}` : action.action === "block" ? `+${v}` : `+${v}`,
      color: action.action === "block" || blocked ? "rgb(100,100,255)" : action.action === "damage" ? "red" : action.action === "buff" || action.action === "gold" ? "green" : "purple",
      person, attacker: { person: attacker.person, key: attacker.key },
    }

    setField((pre:any)=>({
      ...pre,
      op: prev.op,
      me: prev.me,
      effect,
    }));
    setTick((prev)=>prev + 1);
  }

  const cardMove = ({ action, person, key, card }:any) => {
    const prev:any = { ...field };
    switch (action) {
      case "move": {
        setSelected(card);
        prev[person][key] = null;
        setField(prev);
        break;
      }
      case "take": {
        setMe({ ...me, hand: [...me.hand, card] });
        prev.me[key] = null;
        setField(prev);
        break;
      }
      case "shuffle": {
        setMe({ ...me, deck: [...me.deck, card] });
        prev.me[key] = null;
        setField(prev);
        break;
      }
      case "discard": {
        if(person === "me") {
          let cards = [card];
          if(card.sp) {
            for(const i in card.sp) {
              if(i === "Shuffle Copy") {
                cards.push(card);
              } else if(i === "Shuffle") {
                cards.push(curses[card.sp[i]]);
              }
            }
          }
          setMe({ ...me, dead: [...me.dead, ...cards] });
        }
        else {
          op.dead.push(card);
          setOp(op);
        }
        console.log("removing...")
        let before = field;
        before[person][key] = null;
        setField((prev:any)=>({
          ...prev,
          [person]: before[person],
        }));
        break;
      }
      case "exhaust": {
        prev.me[key] = null;
        setField(prev);
        break;
      }
    }
    // console.log("move ticked")
    setTick((prev)=>prev + 1);
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

    if(!botTurn) {
      setMe(prev);
      setShowHand(true);
      setTick((prev)=>prev + 1);
    } else {
      setOp(prev);
      setTick((prev)=>prev + 1);
    }
  }

  const checkAoe = async({ attacker, person, key, card, action }:any) => {
    if(card.unit === "hero" && action.minionOnly) return;
    if(action.aoe) {
      for(const x in field[person]) {
        if(field[person][x]) {
          cardAct({ card, person, key: Number(x), action, attacker });
          await delay();
        }
      }
    } else cardAct({ card, person, key, action, attacker });
  };

  const cardClick = async({ attacker, card, key, person }:any) => {
    if(attacking || attacker) {
      let aCard = attacking || attacker;
      const combat = () => new Promise(async(callback:any) => {
        for(const i in aCard.actions) {
          await checkAoe({ attacker: aCard, person, key, card, action: aCard.actions[i] });
          if(Number(i) !== aCard.actions.length - 1) await delay();
        }
        callback();
      });
      setAttackable(false);
      if(powers.repeat !== -1) await combat();
      if(powers.repeat) {
        for(let i = 0; i < powers.repeat; i ++) await combat();
        powers.repeat = 0;
      }

      if(aCard.sp) {
        for(const i in aCard.sp) {
          if(i === "draw") {
            draw(aCard.sp[i]);
          } else if(i === "Change Damage") {
            aCard.actions[0].value += aCard.sp[i];
          } else if(i === "Draw amount") {
            setDrawAmount(drawAmount + aCard.sp[i]);
          } else if(i === "Discard" || i === "Exhaust") {
            setDiscarding(aCard.sp[i]);
            if(i === "Discard") setExhausting(false);
            else setExhausting(true);
            setShowHand(true);
          } else if(i === "Repeat next card") {
            powers.repeat = 1;
          } else if(i === "Block on play") {
            powers.blockOnPlay = aCard.sp[i];
          }
        }
      }
      if(!botTurn) cardMove({ card: aCard, person: "me", key: 2, action: aCard.unit === "power" || aCard.curse ? "exhaust" : "discard" });
      setAttacking(null);
    }
  }

  const endTurn = async(person:string) => {
    setEnded(true);
    console.log("ended turn")
    let energyGain = 3;
    let gold = (person === "op" ? me.gold : op.gold) + baseGold + field.stage;
    
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
            await checkAoe({ 
              attacker: { ...prev[person][i], person, key: Number(i) }, card: person === "me" ? prev.me[7] : prev.op[2], 
              person, key: action.self ? Number(i) : person === "me" ? 7 : 2, action 
            });
            await delay();
          } else {
            let taunted = false;
            for(const x in prev[enemy]) {
              if(prev[enemy][x] && prev[enemy][x].taunt) {
                taunted = true;
                await checkAoe({ attacker: { ...prev[person][i], person, key: Number(i) }, card: prev[enemy][x], person: enemy, key: Number(x), action });
                await delay();
              }
            }
            if(!taunted) {
              await checkAoe({ 
                attacker: { ...prev[person][i], person, key: Number(i) }, card: prev[enemy][enemyHero], person: enemy, key: enemyHero, action 
              });
              await delay();
            }
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
      return { ...prev, time: times(pre.time).next, stage: (pre.time === "Dawn" || pre.time === "Dusk") && pre.stage < 2 ? pre.stage + 1 : pre.stage, effect: {} }
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
      op.turn = true;
      op.drawable = true;
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
    setShopCards(null);
    if(powers.blockOnPlay) delete powers.blockOnPlay;
    if(botPowers.blockOnPlay) delete botPowers.blockOnPlay;

    if(bot) {
      botTurn = !botTurn;
      if(botTurn) {
        botMove({ 
          field, opDrawAmount, op, time: prev.time, botPowers,
          setOp, setField, cardClick, cardMove, draw, endTurn,
        })
      }
    }
    setTick(tick + 1);
    setEnded(false);
  }

  return (
    <div className="text-center">
    <Grid container spacing={3} style={{ width: "100%" }}>
      <Grid xs={2} item>
        <Grid item>
            <div className={op.deck.length ? "board m-auto" : "board empty m-auto"}>
              <h4>Deck: {op.deck.length}</h4>
            </div>
        </Grid>
        <Grid item style={{ height: "350px", paddingTop: "50px" }}>
          <div style={{ 
            padding: "20px", 
            backgroundColor: times(field.time).backgroundColor,
            color: times(field.time).color, borderRadius: "10px" 
          }}>
          <h3 style={{ fontWeight: "bold" }}>{field.time}</h3>
          <p style={{ fontWeight: "bold", fontSize: "14px", whiteSpace: "pre-line" }}>{times(field.time).status}</p>
          <h3 style={{ fontWeight: "bold", marginTop: "15px" }}>Stage: {field.stage + 1}</h3>
          <p style={{ fontWeight: "bold", fontSize: "16px", whiteSpace: "pre-line", margin: 0 }}>
            {"Gold:"} {2 + field.stage}
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
        {attacking || selected || discarding ? null : me.turn && shopCards && !ended ? (
          <Button
          style={{ marginTop: "15px" }}
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
            <div style={{ backgroundColor: fieldColor(op.tribe, botTurn || op.turn) }}>
            <Box display="flex" flexWrap="wrap" style={{ 
              width: "800px", margin: "auto",
              position: "relative",
            }}>
              <Effect effect={field.effect} show={field.effect && field.effect.person === "op"} />
            {field.op.map((card:any,key:number)=>(
                card ? (
                  <GameCard card={card} key={key} me={false}
                  targeted={field.effect && field.effect.attacker && field.effect.attacker.person === "op" && field.effect.attacker.key === key ? true : 
                  attackable && (
                    attacking.unit === "debuff" || attacking.unit === "curse" || (attacking.unit === "attack" && (card.taunt || field.op.filter((a:any)=>(a && a.taunt)).length === 0))
                  )}
                  act={(action:string)=>{
                    cardMove({ card, person: "op", key, action });
                  }}
                  click={()=> cardClick({ key, card, person: "op" })}
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
                      setTick((prev)=>prev + 1);
                    }
                  }}
                  />
                )
              ))}
            </Box>
            </div>
            <div style={{ height: "5px", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "30%" }} />
            <div style={{ backgroundColor: fieldColor(me.tribe, me.turn) }}>
            <Box display="flex" flexWrap="wrap"
            style={{ 
              width: "800px", margin: "auto", position: "relative",
            }}>
              <Effect effect={field.effect} show={field.effect && field.effect.person === "me"} />
              {field.me.map((card:any,key:number)=>(
                card ? (
                  <GameCard key={key} card={card} me={true}
                  act={(action:string)=> cardMove({ card, person: "me", key, action })}
                  targeted={attacking && attacking.id === card.id ? false : 
                    field.effect && field.effect.attacker && field.effect.attacker.person === "me" && field.effect.attacker.key === key ? true :
                    attackable && (attacking.unit === "skill" || attacking.unit === "power")}
                  click={()=> cardClick({ key, card, person: "me" })}
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
                      setTick((prev)=>prev + 1);
                    }
                  }}
                  />
                )
              ))}
            </Box>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={2} item>
          <Grid item>
            <div className={op.dead.length ? "board m-auto" : "board empty m-auto"}>
              Gravayard<br/>
              Remain: {op.dead.length}
            </div>
          </Grid>
          <Grid item style={{ marginTop: "15px" }}>
            <div className={"board shop m-auto"}>
              <h4>Shop</h4>
              <p>Remain: {shop.length}</p>
              {me.turn ? <Button variant="contained" color={shopCards ? "primary" : "secondary"}
              onClick={()=>{
                setFrom(1);
                if(!shopCards) {
                  const s = [...shop];
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
              <h4>Deck: {me.deck.length}</h4>
                {me.drawable ? (
                  <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={()=>{
                    if(field.stage === 4) draw(drawAmount + 1);
                    else draw(drawAmount);
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
                }}
                >Search</Button>
              </>
              ) : null}
            </div>
          </Grid>
          {!me.turn && !op.turn ? (
            <Button
            style={{ marginTop: "15px" }}
            variant="contained"
            onClick={()=>{
              setFirstTurn(true);
              setDrawAmount(5);
              setMe({ ...me, tribe: "Fire", turn: true, energy: 2, gold: 2, drawable: true });
              setOp({ ...op, tribe: "Water", turn: false });
              setTick(tick + 1);
            }}
            >Start</Button>
          ) : (<Button
            style={{ marginTop: "15px" }}
            variant="contained"
            color="default"
            onClick={()=>setBeforeEnd(true)}
            >Quit</Button>
          )}
      </Grid>
      <div style={{ height: "70px",  width: "100%" }} 
      onMouseEnter={()=>{
        if(!attacking && !selected && !me.drawable) setShowHand(true);
      }}
      />
      {showHand ? (
        <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 1, 
        background: discarding ? "rgb(50,0,0)" :  "rgba(255,255,255,0.3)" }}
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
                pointerEvents: op.turn || (firstTurn && !discarding && (card.unit === "attack" || card.unit === "minion")) ||
                (me.energy < card.cost && !discarding) ? "none" : "all", }}
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
                disabled={op.turn || (firstTurn && !discarding && (card.unit === "attack" || card.unit === "minion")) || (me.energy < card.cost && !discarding)} 
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
          <h4>Are you sure to end?</h4>
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
            <h4 style={{ marginBottom: 10 }}>{from === 1 ? "SHOP" : from === 0 ? "Draw Pile" : "Discard Pile" }</h4>
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
                    }
                  }}>
                  <Card card={card} disabled={card.gold > me.gold} />
                  {from === 1 ? (
                  <div style={{ padding: "0px 20px" }}>
                    <h4 style={{ backgroundColor: "orange", color: "white", fontWeight: "bold", borderRadius: "10px", textAlign: "center" }}>
                      {card.gold}
                    </h4>
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