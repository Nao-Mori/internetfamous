export const endTurn = () => {
  return
}

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