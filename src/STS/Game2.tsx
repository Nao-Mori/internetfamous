import React, { useEffect, useState } from "react";
import { 
  CircularProgress, TextField, CardContent, CardActions, IconButton, Dialog, DialogContent, DialogActions, 
  Box, Tooltip, DialogTitle, withStyles,
} from '@material-ui/core';
import { Edit, Delete, AccountCircle, } from "@material-ui/icons";
import Kard from "@material-ui/core/Card"
import { api, headers } from "../api";
import axios from "axios";
import { allcards } from "./Cards";
import CardBox from "@material-ui/core/Card";
import Connection from "./Connection";
import Button2 from "@material-ui/core/Button";

const getId = () => {
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

const Button = withStyles(() => ({
  root: {
    fontFamily: "inherit",
    fontWeight: "bold"
  },
}))(Button2);

const Card = ({ card, chosen }:any) => {

  return (
    <CardBox
    elevation={10}
    style={{ 
      width: "145px", margin: "5px", textAlign: "center",
      background: chosen ? "rgb(255,255,190)" : card.unit === "hero" ? "white" : card.unit === "minion" ? "rgb(245,245,245)" : card.unit === "curse" || card.unit === "debuff" ? "rgb(255,230,255)" :
      card.unit === "power" ? "rgb(220,220,255)" : card.unit === "skill" ? "rgb(220,255,220)" : "rgb(255,220,220)",
      minHeight: "215px",
      padding: "2px"
    }}>
      <div>
        <Tooltip title={<h4>{card.name}</h4>}>
          <h4 style={{ fontSize: "80%", fontWeight: "bold" }}>
            {card.cost !== undefined ? (
              <b style={{ backgroundColor: "rgb(50,50,255)", color: "white", borderRadius: "50%", padding: "0px 7px" }}>
                {card.cost === -1 ? "X" : card.cost}
              </b>
            ) : null} {card.name}
          </h4>
        </Tooltip>
        <div className="img-container">
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
        ) : card.unit === "curse" ? (
          <img alt="cardpic" src={"https://cdn.xxl.thumbs.canstockphoto.com/magic-book-icon-icon-cartoon-magic-book-icon-in-icon-in-cartoon-style-isolated-vector-illustration-illustration_csp45478923.jpg"} className="compact-image2" />
        ) : card.unit === "debuff" ? (
          <img alt="cardpic" src={"https://previews.123rf.com/images/lineartestpilot/lineartestpilot1802/lineartestpilot180270021/95739430-cartoon-magic-potion.jpg"} className="compact-image2" />
        ) : card.unit === "power" ? (
          <img alt="cardpic" src={"https://thumbs.dreamstime.com/b/colorful-cartoon-energy-symbol-power-thunder-electricity-themed-vector-illustration-icon-stamp-label-certificate-brochure-gift-141945220.jpg"} className="compact-image2" />
        ) : (
          <AccountCircle style={{ fontSize: "70px", color: "rgb(150,150,150)" }} />
        )}
        </div>
        <div style={{ minHeight: "90px" }}>
        {card.hp ? <h4 style={{ marginBottom: "2px", backgroundColor: "red", color: "white", fontWeight: "bold" }}>{card.hp}</h4> : null}
        {card.taunt ? <p className="cardtext" style={{ background: "rgb(100,100,100)" }}>Taunt</p> : null}
        {card.type === "minion" ? (
          <>
            <p style={{ margin: 0 }}>Minion Action:</p>
            {card.actions.map((action:any,key:number)=>(
              <p key={key} style={{ fontWeight: "bold" }}>
                {action.action === "curse" ? 
                `Curse: Add` : ""} {action.el === "hp" ? `${action.value} damage` :
                action.action === "block" ? `${action.value} ${action.el === "block" ? "block" : "tough"}` :
                `${action.multiply ? "x" : ""}${action.value} ${action.el}`} {action.aoe ? "to all" : action.self ? "to itself" : action.minionOnly ? "to a minion" : ""}
              </p>
            ))}
          </>
        ) : card.actions ? card.actions.map((action:any,key:number)=>(
          <p key={key} style={{ fontWeight: "bold" }}>
            {action.action === "curse" ? 
            `Curse: Add${action.drawPile ? " to draw" : " to discard"}` : ""} {action.el === "hp" ? `${action.value} damage` :
            action.action === "block" ? `${action.value} ${action.el === "block" ? "block" : "tough"}` :
            `${action.multiply ? "x" : ""}${action.value} ${action.el}`} {action.aoe ? "to all" : action.self ? "to itself" : action.minionOnly ? "to a minion" : ""}
          </p>
        )) : null}
        {card.sp ? (
          Object.keys(card.sp).map((key:any)=>{
            const value = card.sp[key];
            return <p key={key} style={{ background: "rgb(0,155,155)" }} className="cardtext">{key} {value}</p>
          })
        ) : null}
        {card.defaultBuff ? Object.keys(card.defaultBuff).map((key:any)=>{
              const value = card.defaultBuff[key];
              if(value) return <p key={key} className="cardtext" style={{ background: "rgb(255,100,100)" }}>{key} {value}</p>
              else return null;
        }) : null}
        </div>
        {card.gold ? <p style={{ backgroundColor: "orange", color: "white", margin: 5, borderRadius: "10px", fontWeight: "bold", fontSize: "15px" }}>{card.gold}</p> : null}
      </div>
    </CardBox>
  )
}

export default function Game2 () {
  const [started, setStarted] = useState(false);
  const [decks, setDecks] = useState<any>([]);
  const [currentDeck, setCurrentDeck] = useState<any>(null);
  const [cards] = useState<any>(allcards.cards);
  const [extra] = useState(allcards.extra)
  const [heroes] = useState<any>([
    { name: "Niku", unit: "hero", img: "https://previews.123rf.com/images/jemastock/jemastock1704/jemastock170404002/75576470-happy-boy-wearing-blue-t-shirt-cartoon-icon-over-white-background-colorful-design-vector-illustratio.jpg",
     hp: 100, maxhp: 100, block: 0, buff: {}, debuff: {} }, 
    { name: "Doggo", unit: "hero", img: "https://thumbs.dreamstime.com/b/cartoon-dog-pointer-vektor-cute-welpe-hund-zeiger-f%C3%BCr-design-element-157062009.jpg", hp: 100, maxhp: 100, block: 0, buff: {}, debuff: {} }
  ]);
  const [editDeck, setEditDeck] = useState<any>(null);
  const [editNum, setEditNum] = useState<any>(null);
  const [filter, setFilter] = useState({ level: "", color: "", symbol: "", word: "" });
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState("");
  const [bot, setBot] = useState<any>(null);

  useEffect(()=>{
    axios.post(`${api}/external/getdecks`, {}, headers).then((res:any)=>{
      const decks = res.data;
      for(const i in decks) {
        const cs = decks[i].cards;
        const ex = decks[i].extra;
        const newCards = [];
        const newExtra = [];
        for(const i in cs) {
          newCards.push(cards.filter((a:any)=>a.name === cs[i])[0]);
        }
        for(const i in ex) {
          newExtra.push(extra.filter((a:any)=>a.name === ex[i])[0]);
        }
        decks[i].cards = newCards;
        decks[i].extra = newExtra;
      }  
      setDecks(decks);
      setLoaded(true);
    })
  },[])

  const deckCards = (place:string) => {
    let cs:any = [];
    for(const i in editDeck[place]) {
      let found = false;
      for(const x in cs) {
        if(cs[x].name === editDeck[place][i].name) {
          cs[x].dupe += 1;
          found = true;
        }
      }
      if(!found) cs.push({ ...editDeck[place][i], dupe: 1 })
    }
    return (
      <Box display="flex" flexWrap={"wrap"} style={{ background: place === "cards" ? "rgb(200,200,255)" : "rgb(255,200,200)",
       border: "solid 1px black" }}>
        {cs.map((card:any,key:number)=>(
          <div key={key} style={{ textAlign: "center" }}>
            <Card card={card} />
            <Button
            size="small"
            className="mb-2"
            variant="contained"
            color="primary"
            onClick={()=>{
              setEditDeck({ ...editDeck, [place]: editDeck[place].filter((a:any)=>a.name !== card.name) });
            }}
            >
              Remove ({card.dupe})
            </Button>
          </div>
        ))}
      </Box>
    )
  }

  return (
    <div className="p-2 text-center field">
      {started ? (
        <Connection deck={currentDeck} end={()=>{
          setStarted(false);
          setBot(null);
        }} bot={bot} />
      ) : !loaded ? (
        <CircularProgress />
      ) : (
        <div>
            <h3>Decks</h3>
            <Box border={1} display="flex" flexDirection="row" style={{ maxHeight: "500px", overflowY: "auto", flexWrap: "wrap" }}>
            {decks.map((deck:any,key:number)=>(
              <Kard key={key} style={{ backgroundColor: "rgb(240,255,255)", width: "200px", margin: 5, }}>
                  <CardContent>
                  <h4>{deck.name}<br/>({deck.cards.length},{deck.extra.length})</h4>
                  {deck.hero ? (
                    <Card card={deck.hero} key={key}/>
                  ) : null}
                  <Button
                  style={{ margin: "10px" }}
                  variant="contained"
                  color="primary"
                  onClick={()=>{
                    const c = [];
                    for(const i in deck.cards) {
                      c.push({ ...deck.cards[i], id: getId() });
                    }
                    const e = [];
                    for(const i in deck.extra) {
                      e.push({ ...deck.extra[i], id: getId() });
                    }
                    setCurrentDeck({ ...deck, cards: c, extra: e, hero: { ...deck.hero, id: getId(), buff: {} } });
                    setStarted(true);
                  }}
                  >Play</Button>
                  <Button
                  className="m-2"
                  variant="contained"
                  color="primary"
                  onClick={()=>{
                    const c = [];
                    for(const i in deck.cards) {
                      c.push({ ...deck.cards[i], id: getId() });
                    }
                    const e = [];
                    for(const i in deck.extra) {
                      e.push({ ...deck.extra[i], id: getId() });
                    }
                    setCurrentDeck({ ...deck, cards: c, extra: e, hero: { ...deck.hero, id: getId(), buff: {} } });
                    const b = [];
                    const ran = Math.floor(Math.random() * (decks.length - 1));
                    const botDeck = decks[ran];
                    for(const i in botDeck.cards) {
                      b.push({ ...botDeck.cards[i], id: getId() });
                    }
                    const be = [];
                    for(const i in botDeck.extra) {
                      be.push({ ...botDeck.extra[i], id: getId() });
                    }
                    setBot({ cards: b, extra: be, hero: { ...botDeck.hero, id: getId() } });
                    setStarted(true);
                  }}
                  >Play Bot</Button>
                </CardContent>
                <CardActions>
                  <IconButton
                  size="small"
                  onClick={()=>{
                    setEditNum(key);
                    setEditDeck(deck);
                  }}
                  ><Edit /></IconButton>
                  <IconButton
                  size="small"
                  onClick={()=>{
                    const d = [...decks];
                    d.splice(key, 1);
                    setDecks(d);
                    axios.post(`${api}/external/removedeck`, { id: deck.id }, headers);
                  }}
                  ><Delete /></IconButton>
                </CardActions>
              </Kard>
            ))}
            </Box>
            <Button
            style={{ marginTop: "15px" }}
            color="primary"
            variant="contained"
            onClick={()=>{
              setEditDeck({ name: "Deck", cards: [], extra: [], id: getId() });
            }}
            >Create New Deck</Button>
            <br/><br/>
            <h3>Heroes ({heroes.length})</h3>
            <Box border={1} display="flex" justifyContent="center" flexWrap="wrap" style={{ maxHeight: "600px", overflowY: "auto" }}>
            {heroes.map((card:any,key:number)=>(
              <div key={key}>
                <Card card={card} />
              </div>
            ))}
            </Box>
            <h3>Cards ({cards.length})</h3>
            {/* <Filter filter={filter} setFilter={(fil:any)=>setFilter(fil)} /> */}
            <Box border={1} display="flex" justifyContent="center" flexWrap="wrap" style={{ maxHeight: "800px", overflowY: "auto" }}>
            {(cards.filter((a:any)=>{
            if(filter.level && filter.level !== a.level) return false;
            if(filter.color && filter.color !== a.color) return false;
            if(filter.symbol && filter.symbol !== a.symbol) return false;
            if(filter.word && a.name.indexOf(filter.word) < 0) return false;
            return true;
            })).map((card:any,key:number)=>(
              <div key={key}>
                <Card card={card} />
              </div>
            ))}
            </Box>
            <h3>Shop Cards ({extra.length})</h3>
            {/* <Filter filter={filter} setFilter={(fil:any)=>setFilter(fil)} /> */}
            <Box border={1} display="flex" justifyContent="center" flexWrap="wrap" style={{ maxHeight: "800px", overflowY: "auto" }}>
            {(extra.filter((a:any)=>{
            if(filter.level && filter.level !== a.level) return false;
            if(filter.color && filter.color !== a.color) return false;
            if(filter.symbol && filter.symbol !== a.symbol) return false;
            if(filter.word && a.name.indexOf(filter.word) < 0) return false;
            return true;
            })).map((card:any,key:number)=>(
              <div key={key}>
                <Card card={card} />
              </div>
            ))}
            </Box>
        </div>
      )}
      {editDeck ? (
        <Dialog fullScreen open={Boolean(editDeck)} onClose={()=>{
          setEditNum(null);
          setEditDeck(null);
        }}>
          <DialogContent style={{ backgroundColor: "rgb(240,240,240)" }}>
            <TextField
            className="mb-2"
            size="small"
            InputProps={{
              style: { background: "white" }
            }}
            variant="outlined"
            value={editDeck.name} label="Name" 
            onChange={(e:any)=>{
              setEditDeck({ ...editDeck, name: e.target.value });
            }}
            />
            <Box display="flex" flexDirection="row" flexWrap="wrap" style={{ maxHeight: "300px", overflowY: "auto" }}>
            {heroes.map((card:any,key:number)=>(
              <div key={key} style={{ textAlign: "center" }}>
                <Card card={card} chosen={editDeck.hero && editDeck.hero.name === card.name} />
                {!editDeck.hero || editDeck.hero.name !== card.name ? (
                  <Button
                  className="mb-2"
                    size="small"
                    variant="contained"
                    color={"primary"}
                    onClick={()=>{
                      setEditDeck({ ...editDeck, hero: card });
                    }}
                    >
                      Choose
                    </Button>
                  ) : null}
              </div>
            ))}
            </Box>
            <h4 className="mt-3">Cards: {editDeck.cards.length}</h4>
            <Button
            size="small"
            variant="contained"
            color="primary"
            className="mb-2"
            onClick={()=>{
              setShow("cards");
            }}
            >
              Add Cards
            </Button>
            {deckCards("cards")}
            <h4 className="mt-3">Shop: {editDeck.extra.length}</h4>
            <Button
            size="small"
            variant="contained"
            color="primary"
            className="mb-2"
            onClick={()=>{
              setShow("extra");
            }}
            >
              Add Shop Cards
            </Button>
            {deckCards("extra")}
            <Dialog open={Boolean(show)} maxWidth="xl" fullWidth onClose={()=>setShow("")}>
              <DialogTitle>
              <h4>{editDeck[show] ? editDeck[show].length : 0} Cards Added</h4>
              </DialogTitle>
              <DialogContent>
                <Box display="flex" flexDirection="row" flexWrap="wrap" style={{ overflowY: "auto", justifyContent: "center" }}>
                  {show ? (show === "cards" ? cards : extra).map((card:any,key:number)=>(
                    <div key={key} 
                    style={{ textAlign: "center", marginBottom: "5px", background: editDeck[show].filter((a:any)=>a.name === card.name).length ? "rgb(255,255,120)" : "inherit" }}>
                      <Card card={card} />
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={()=>{
                          setEditDeck({ ...editDeck, [show]: [...editDeck[show], card] });
                        }}
                        >
                          Add ({editDeck[show].filter((a:any)=>a.name === card.name).length})
                        </Button>
                    </div>
                  )) : null}
                </Box>
              </DialogContent>
              <DialogActions>
                
                <Button
                onClick={()=>{
                  setShow("");
                }}
                >Close</Button>
              </DialogActions>
            </Dialog>
          </DialogContent>
          <DialogActions>
          <Button
            onClick={()=>{
              setEditDeck(null);
              setEditNum(null);
            }}
            >Cancel</Button>
            <Button
            variant="contained"
            color="primary"
            onClick={()=>{
              setEditNum(null);
              setEditDeck(null);
              const edited = [...editDeck.cards].sort((a:any,b:any)=>{
                return ('' + a.name).localeCompare(b.name);
              });
              let nDeck;

              let ids = [];
              for(const i in edited) {
                ids.push(edited[i].name);
              }
              let ids2 = [];
              for(const i in editDeck.extra) {
                ids2.push(editDeck.extra[i].name);
              }
              
              if(editNum !== null) {
                nDeck = [...decks];
                nDeck[editNum] = { cards: edited, ...editDeck };
                axios.post(`${api}/external/savedeck`, { 
                  deck: { ...editDeck, cards: ids, extra: ids2, hero: editDeck.hero }, id: editDeck.id,
                }, headers);
              } else {
                nDeck = [...decks, { cards: edited, ...editDeck }];
                axios.post(`${api}/external/savedeck`, { 
                  deck: { ...editDeck, cards: ids, extra: ids2, hero: editDeck.hero },
                }, headers);
              }
              setDecks(nDeck);
            }}
            >Save</Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </div>
  )
};