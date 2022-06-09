export const allcards = {
  cards: [
    //Free Tier
    { name: "Troll Punch", unit: "attack", cost: 1, actions: [{ action: "damage", el: "hp", value: 8 }] },
    { name: "Shock Wave", unit: "attack", cost: 1, actions: [{ action: "damage", el: "hp", value: 5, aoe: true }] },
    { name: "Twin Strike", unit: "attack", cost: 1, actions: [{ action: "damage", el: "hp", value: 3 }, { action: "damage", el: "hp", value: 3 }] },
    { name: "Bash", unit: "attack", cost: 2, actions: [{ action: "damage", el: "hp", value: 7 }, { action: "debuff", el: "vulnerable", value: 2 }] },
    { name: "Sword", unit: "attack", cost: 2, actions: [{ action: "damage", el: "hp", value: 15 }] },
    { name: "Naguri", unit: "attack", cost: 1, actions: [{ action: "damage", el: "hp", value: 4 }, { action: "debuff", el: "weak", value: 1 }] },
    { name: "Jab", unit: "attack", cost: 0, actions: [{ action: "damage", el: "hp", value: 4 }] },

    { name: "Slap the bitch", unit: "attack", cost: 2, actions: [{ action: "damage", el: "hp", value: 7 }, { action: "gold", el: "gold", value: 2 }] },

    { name: "Energy Shield", unit: "skill", cost: 2, sp: { "Retain": "in hand" }, actions: [{ action: "block", el: "block", value: 15 }] },
    { name: "Shield", unit: "skill", cost: 2, actions: [{ action: "block", el: "block", value: 19 }] },
    { name: "Leap", unit: "skill", cost: 1, actions: [{ action: "block", el: "block", value: 10 }] },
    //{ name: "Deflect", unit: "skill", cost: 1, actions: [{ action: "block", el: "block", value: 7 }, { action: "buff", el: "negate", value: 1 }] },
    { name: "Select", unit: "skill", cost: 1, sp: { draw: 1 }, actions: [{ action: "block", el: "block", value: 6 }] },
    { name: "Quick Shield", unit: "skill", cost: 1, sp: { ["Discard"]: 1 }, actions: [{ action: "block", el: "block", value: 9 }] },
    { name: "Robust", unit: "skill", cost: 1, sp: { "Retain": "in hand" }, actions: [{ action: "block", el: "spBlock", value: 4 }] },

    { name: "Poker", unit: "skill", cost: 1, sp: { draw: 2 }, actions: [] },
    { name: "Cycle", unit: "skill", cost: 1, sp: { draw: 1, "Exhaust": 1 }, actions: [] },
    { name: "Cleaning", unit: "skill", cost: 0, sp: { "Exhaust": 1 }, actions: [] },
    { name: "Arbeit", unit: "skill", cost: 2, actions: [{ action: "gold", el: "gold", value: 3 }] },

    { name: "Terror", unit: "debuff", cost: 1, actions: [{ action: "debuff", el: "vulnerable", value: 2 }] },
    { name: "Shield Break", unit: "debuff", cost: 1, actions: [{ action: "debuff", el: "flail", value: 3 }] },

    { name: "Dumping", unit: "curse", cost: 0, actions: [{ action: "curse", el: "Burn", value: 1 }] },

    { name: "Goblin", unit: "minion", cost: 2, hp: 13, maxHp: 13, block: 0, actions: [{ action: "damage", el: "hp", value: 7 }], buff: {}, debuff: {} },
    { name: "Quarry", unit: "minion", cost: 3, building: true, hp: 22, maxHp: 22, block: 0, actions: [{ action: "gold", el: "gold", value: 2 }], buff: {}, debuff: {} },
    { name: "Guard", unit: "minion", cost: 2, hp: 15, maxHp: 15, block: 0, actions: [{ action: "block", el: "block", value: 5 }], buff: {}, debuff: {} },
    { name: "Skeleton", unit: "minion", cost: 1, hp: 5, maxHp: 5, block: 0, actions: [{ action: "damage", el: "hp", value: 5 }], buff: {}, debuff: {} },

    { name: "Excercise", unit: "skill", cost: 1, actions: [{ action: "buff", el: "strength", value: 1 }] },
    { name: "Thorned Armor", unit: "skill", cost: 1, actions: [{ action: "buff", el: "thorns", value: 4 }] },
    
  ],
  extra: [
    //Gold 2
    { name: "Pommel Strike", gold: 2, unit: "attack", cost: 1, sp: { draw: 1 }, actions: [{ action: "damage", el: "hp", value: 9 }] },
    { name: "Sudden Bark", gold: 2, unit: "attack", cost: 1, actions: [{ action: "damage", el: "hp", value: 8 }, { action: "debuff", el: "weak", value: 2 }] },
    { name: "Chincha Strike", gold: 2, unit: "attack", cost: 1, sp: { ["Change Damage"]: 7 }, actions: [{ action: "damage", el: "hp", value: 7 }] },
    { name: "Copy Mori Slash", gold: 2, unit: "attack", cost: 0, sp: { "Shuffle Copy": 1 }, actions: [{ action: "damage", el: "hp", value: 7 }] },
    { name: "Dual Blades", gold: 2, unit: "attack", cost: 1, actions: [{ action: "damage", el: "hp", value: 6 }, { action: "damage", el: "hp", value: 6 }] },

    { name: "Blur", gold: 2, unit: "skill", cost: 0, actions: [{ action: "block", el: "block", value: 10 }] },
    { name: "Recycled Shield", gold: 2, unit: "skill", cost: 1, sp: { ["Exhaust"]: 1 }, actions: [{ action: "block", el: "block", value: 17 }] },
    { name: "Cherish", gold: 2, unit: "skill", cost: 1, actions: [{ action: "block", el: "block", value: 14, minionOnly: true }, { action: "buff", el: "strength", value: 3, minionOnly: true }] },
    { name: "Vault", gold: 2, unit: "skill", cost: 1, sp: { draw: 2 }, actions: [{ action: "block", el: "block", value: 10 }] },
    { name: "Flourish", gold: 2, unit: "skill", cost: 2, sp: { "Retain": "in hand" }, actions: [{ action: "block", el: "block", value: 21 }, { action: "gold", el: "gold", value: 3 }] },

    { name: "Lucky", gold: 2, unit: "skill", cost: 0, actions: [{ action: "gold", el: "gold", value: 2 }] },

    { name: "Playin Games", gold: 2, unit: "skill", cost: 0, sp: { draw: 2 }, actions: [] },
    { name: "Energize", gold: 2, unit: "skill", cost: 0, actions: [{ action: "energy", el: "energy", value: 1 }] },
    { name: "We gotta get rich", gold: 2, unit: "skill", cost: -1, actions: [{ action: "gold", el: "gold", value: 3 }] },

    { name: "Magic Claw", gold: 2, unit: "debuff", cost: 0, actions: [{ action: "debuff", el: "scar", value: 4 }] },
    { name: "Voice of Fear", gold: 2, unit: "debuff", cost: 0, actions: [{ action: "debuff", el: "vulnerable", value: 1 }, { action: "debuff", el: "vulnerable", value: 1 }] },

    { name: "Accident", gold: 2, unit: "curse", cost: 1, actions: [{ action: "curse", el: "Burn", value: 3 }] },

    { name: "Goblin Giant", gold: 2, unit: "minion", cost: 3, hp: 30, maxHp: 30, taunt: true, block: 0, actions: [{ action: "damage", el: "hp", value: 12 }], buff: {}, debuff: {} },
    //{ name: "Lisselotte", gold: 2, unit: "minion", cost: 1, hp: 20, maxHp: 20, block: 0, actions: [{ action: "buff", el: "negate", value: 1 }], buff: {}, debuff: {} },
    { name: "Tower of Terror", gold: 2, unit: "minion", cost: 1, building: true, hp: 16, maxHp: 16, block: 0, actions: [{ action: "debuff", el: "weak", value: 1, aoe: true }], buff: {}, debuff: {} },

    //Gold 3
    { name: "Giant Hammer", gold: 3, unit: "attack", cost: 3, actions: [{ action: "damage", el: "hp", value: 35 }] },
    { name: "Alpha", gold: 3, unit: "attack", cost: 1, sp: { "Shuffle": "Omega" }, actions: [{ action: "damage", el: "hp", value: 10 }] },
    { name: "Whirlwind", gold: 3, unit: "attack", cost: -1, actions: [{ action: "damage", el: "hp", value: 8, aoe: true }] },

    { name: "Technic", gold: 3, unit: "power", cost: 1, sp: { "Draw amount": 1 }, actions: [] },

    { name: "Ice Block", gold: 2, unit: "skill", cost: 2, sp: { "Retain": "in hand" }, actions: [{ action: "block", el: "block", value: 30 }] },
    { name: "Pray", gold: 3, unit: "skill", cost: 1, sp: { "Retain": "in hand" }, actions: [{ action: "block", el: "block", value: 11, aoe: true }] },

    { name: "Miracle", gold: 3, unit: "skill", cost: 0, sp: { "Retain": "in hand" }, actions: [{ action: "energy", el: "energy", value: 1 }] },

    { name: "Katara", gold: 3, unit: "minion", cost: 2, hp: 22, maxHp: 22, block: 0, actions: [{ action: "damage", el: "hp", value: 6 }, { action: "damage", el: "hp", value: 6 }], buff: {}, debuff: {} },
    { name: "Tower of Energy", gold: 3, unit: "minion", cost: 2, building: true, hp: 25, maxHp: 25, block: 0, actions: [{ action: "energy", el: "energy", value: 1 }], buff: {}, debuff: {} },
    { name: "Wall", gold: 3, unit: "minion", cost: 3, building: true, hp: 33, maxHp: 33, taunt: true, block: 0, actions: [{ action: "block", el: "spBlock", value: 3, aoe: true }], buff: { thorns: 3 }, debuff: {}, defaultBuff: { thorns: 3 } },

    //Gold 4
    { name: "Lee Chin Strike", gold: 4, unit: "attack", cost: 2, actions: [{ action: "damage", el: "hp", value: 20 }, { action: "debuff", el: "weak", value: 2 }, { action: "debuff", el: "vulnerable", value: 2 }] },
    { name: "Flame Sword", gold: 4, unit: "attack", cost: 1, actions: [{ action: "damage", el: "hp", value: 14 }, { action: "curse", el: "Burn", value: 1, drawPile: true }] },
    { name: "Haiya", gold: 4, unit: "attack", cost: 2, actions: [{ action: "damage", el: "hp", value: 5 }, { action: "damage", el: "hp", value: 5 }, { action: "damage", el: "hp", value: 5 }, { action: "damage", el: "hp", value: 5 }] },

    { name: "Hug", gold: 4, unit: "skill", cost: 0, actions: [{ action: "block", el: "block", value: 7 }, { action: "buff", el: "strength", value: 2 }] },
    { name: "Equip", gold: 4, unit: "skill", cost: 2, sp: { "Retain": "in hand" }, actions: [{ action: "block", el: "block", value: 22, aoe: true }] },
    { name: "Wind Shield", gold: 4, unit: "skill", cost: -1, actions: [{ action: "block", el: "block", value: 19 }] },
    { name: "Shadow Clone", gold: 4, unit: "skill", cost: 0, sp: { "Retain": "in hand" }, actions: [{ action: "block", el: "spBlock", value: 6 }, { action: "buff", el: "negate", value: 1 }] },

    { name: "Trick", gold: 4, unit: "skill", cost: 0, sp: { "Exhaust": 1 }, actions: [{ action: "energy", el: "energy", value: 1 }, { action: "block", el: "block", value: 8 }] },
    { name: "Twisted Fate", gold: 4, unit: "skill", cost: 0, sp: { draw: 4 }, actions: [] },

    { name: "Infect", gold: 4, unit: "curse", cost: 0, actions: [{ action: "curse", el: "Deadly Poison", value: 1 }] },

    { name: "Tower of Power", gold: 4, unit: "minion", cost: 2, building: true, hp: 24, maxHp: 24, block: 0, actions: [{ action: "buff", el: "strength", value: 2 }], buff: {}, debuff: {} },
    { name: "Disu Doggu", gold: 4, unit: "minion", cost: 2, hp: 28, maxHp: 28, block: 0, actions: [{ action: "curse", el: "Pointoresu", value: 1 }], buff: {}, debuff: {} },
    { name: "Barricade and Builder", gold: 4, unit: "minion", building: true, cost: 3, hp: 32, maxHp: 32, block: 0, actions: [{ action: "buff", el: "thorns", value: 2, aoe: true }, { action: "block", el: "block", value: 8, aoe: true }], buff: {}, debuff: {} },
    { name: "Goblin Hut", gold: 4, unit: "minion", cost: 2, building: true, hp: 30, maxHp: 30, block: 0, actions: [{ action: "summon", el: "Goblin", value: 1 }], buff: {}, debuff: {} },

    //Gold 5
    { name: "Nova", unit: "attack", cost: 0, actions: [{ action: "damage", el: "hp", value: 11, aoe: true }] },

    { name: "Chilling Armor", gold: 5, unit: "skill", cost: 0, actions: [{ action: "block", el: "block", value: 20 }] },

    { name: "War Cry", gold: 5, unit: "power", cost: 0, sp: { "Block on play": 7 }, actions: [] },
    { name: "Limit Break", gold: 5, unit: "skill", cost: 1, actions: [{ action: "buff", el: "strength", value: 2, multiply: true }] },

    { name: "Assassin", gold: 5, unit: "minion", cost: 2, hp: 10, maxHp: 10, block: 0, actions: [{ action: "damage", el: "hp", value: 20 }], buff: {}, debuff: {} },
    { name: "Battle Ship", gold: 5, unit: "minion", img: "https://i.pinimg.com/originals/c3/69/70/c36970fbf154d7b3ecd0b45275c1efe3.png",
     cost: 3, building: true, hp: 35, maxHp: 35, block: 0, actions: [{ action: "damage", el: "hp", value: 18 }, { action: "debuff", el: "flail", value: 1 }], buff: {}, debuff: {} },
    { name: "Wizzard", gold: 5, unit: "minion", cost: 3, hp: 30, maxHp: 30, block: 0, actions: [{ action: "damage", el: "hp", value: 14, aoe: true }], buff: {}, debuff: {} },

    //Gold 7
    { name: "Three Seven Real", gold: 7, unit: "attack", cost: 1, sp: { "draw": 1 }, img: "https://thumbs.dreamstime.com/z/martial-arts-kung-fu-kick-17627551.jpg",
    actions: [{ action: "damage", el: "hp", value: 7 }, { action: "damage", el: "hp", value: 7 }, { action: "damage", el: "hp", value: 7 }] },
    { name: "Meteor", gold: 7, unit: "attack", cost: 3, img: "https://previews.123rf.com/images/tarasdubov/tarasdubov2010/tarasdubov201000949/158007221-meteor-with-trail-of-fire-celestial-object-flying-in-sky-cartoon-flat-illustration-comet-with-tail-d.jpg",
    actions: [{ action: "damage", el: "hp", value: 40 }, { action: "damage", el: "hp", value: 10, aoe: true }] },
    { name: "Earth Quake", gold: 7, unit: "attack", cost: 2, img: "https://static8.depositphotos.com/1472772/978/i/950/depositphotos_9787265-stock-photo-earthquake-3d-illustration.jpg",
    actions: [{ action: "damage", el: "hp", value: 30, aoe: true }] },

    { name: "Shooting Star", gold: 7, unit: "skill", cost: 1, img: "https://png.pngtree.com/png-vector/20220118/ourmid/pngtree-cartoon-hand-drawn-shooting-star-png-image_4303801.png",
    actions: [{ action: "block", el: "block", value: 20 }, { action: "block", el: "spBlock", value: 8 }, { action: "buff", el: "negate", value: 2 }] },

    { name: "Greeding", gold: 7, unit: "skill", cost: 0, sp: { draw: 2 }, actions: [{ action: "energy", el: "energy", value: 2 }] },
    { name: "Glorious Days", gold: 7, unit: "skill", cost: 0, sp: { ["Repeat next card"]: 1 }, actions: [] },

    { name: "Burning Red", gold: 7, unit: "curse", cost: 0, img: "https://cutewallpaper.org/22/cartoon-fire-wallpapers/2086621982.jpg",
    actions: [{ action: "curse", el: "Burn", value: 3, drawPile: true }] },

    { name: "Obelisk", gold: 7, unit: "minion", cost: 3, building: true, hp: 50, maxHp: 50, block: 0, actions: [{ action: "energy", el: "energy", value: 1 }, { action: "block", el: "block", value: 10 }], buff: {}, debuff: {} },
  
    //Gold 10
    { name: "Corruption", gold: 10, unit: "attack", cost: 1, img: "https://thumbs.dreamstime.com/b/skull-bones-symbol-danger-funny-cartoon-illustration-comic-toxic-smoke-acid-vapor-green-poison-cloud-smelly-smell-177657868.jpg",
    actions: [{ action: "damage", el: "hp", value: 20 }, { action: "curse", el: "Deadly Poison", value: 2, drawPile: true }, { action: "debuff", el: "scar", value: 4 }] },
    
    { name: "Next Level", gold: 10, unit: "skill", cost: 0, img: "https://png.pngitem.com/pimgs/s/242-2427998_transparent-man-barbecuing-clipart-fire-accident-and-first.png",
     actions: [{ action: "buff", el: "strength", value: 10 }] },
    
    { name: "Raged Golem", gold: 10, unit: "minion", cost: 4, hp: 60, maxHp: 60, taunt: true, block: 0, img: "https://mpng.subpng.com/20190628/ppj/kisspng-golem-video-games-bulbapedia-image-clip-art-5d1613720952d6.7062731615617278580382.jpg",
    actions: [{ action: "damage", el: "hp", value: 30 }, { action: "buff", el: "strength", value: 10, self: true }], buff: {}, debuff: {} },

    //Gold 20
    { name: "The End", gold: 20, unit: "attack", cost: 5, img: "https://thumbs.dreamstime.com/z/cartoon-meteor-rain-comets-falling-down-vector-meteorite-cartoon-meteor-rain-comets-falling-down-vector-meteorite-shooting-stars-101945684.jpg",
    sp: { "Retain": "in hand" }, actions: [{ action: "damage", el: "hp", value: 100, aoe: true }] },
  ]
}

export const curses:any = {
  "Broken Sword": { name: "Broken Sword", unit: "attack", cost: 1, actions: [{ action: "damage", el: "hp", value: 1 }] },
  "Pointoresu": { name: "Pointoresu", unit: "skill", cost: 1, curse: [], actions: [] },
  "Burn": { name: "Burn", unit: "skill", cost: 1, curse: [{ action: "damage", el: "hp", value: 4, curse: true }], actions: [] },
  "Deadly Poison": { name: "Deadly Poison", unit: "skill", cost: 2, curse: [{ action: "damage", el: "hp", value: 10, curse: true }], actions: [] },

  "Omega": { name: "Omega", unit: "attack", cost: 1, actions: [{ action: "damage", el: "hp", value: 30 }] },
  "Goblin": allcards.cards.filter((a:any)=>a.name === "Goblin")[0],
}