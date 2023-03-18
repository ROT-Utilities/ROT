/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { world } from "@minecraft/server";
import { setTickInterval } from "../../Papers/paragraphs/ExtrasParagraphs.js";
import { hexToNumber, numberToHex } from "../../Papers/paragraphs/ConvertersParagraphs.js";
import { getPost, openAH } from "./main.js";
import Player from "../../Papers/PlayerPaper.js";
import Database from "../../Papers/DatabasePaper.js";
import quick from "../../quick.js";
const config = quick.epics['Auction House'];
let color = 0;
try {
    world.scoreboard.addObjective(config.obj, config.obj);
}
catch (e) { }
;
setTickInterval(() => {
    if (config.tag.length)
        world.getAllPlayers().forEach(player => player.hasTag(config.tag) && openAH(Player.playerType(player, { from: config.npcName, sound: false })));
    if (!config.coolHouseNames)
        return;
    if (color > config.houseName.length)
        color = 0;
    else
        color++;
    let name = config.houseName.split('');
    name.splice(color, 0, config.color3);
    name.splice(color + 2, 0, config.color2);
    name.splice(color + 4, 0, config.color1);
    color !== 0 && name.splice(color - 1, 0, config.color2);
    name = '§l' /*§r*/ + config.color1 + name.join('');
    for (const dim of ['overworld', 'nether', 'the end'])
        Array.from(world.getDimension(dim).getEntities({ type: 'rot:ah' })).forEach(entity => entity.nameTag = name);
}, 5);
/** Identifers
 * AHP {postData}
 * AHI {itemData}
 * AHC {collectData}
 * Check posts
*/
//States: (collect items, collect failed auction items), (collect old bid money, collect money)
if (config.checkPosts)
    setTickInterval(() => checkPosts(), config.checkPosts * 20);
export function checkPosts() {
    const date = new Date().getTime();
    //Closing old posts
    Database.allTables('AHP').forEach(p => {
        if (hexToNumber(p) > date)
            return;
        const post = getPost(p), id = numberToHex(new Date().getTime() + (config.maxHoldTime * 3.6e+6));
        ;
        if (!post)
            return;
        const db = Database.register(id, 'AHC');
        if (post.name !== post.itemName)
            db.write('n', post.name);
        if (post.bidID[0])
            db.write('w', [post.bidID[0], post.bids[0]]);
        db.writeMany({
            i: post.itemName,
            d: p,
            a: post.amount,
            p: post.startPrice,
            c: [post.creator.id, post.creator.name, post.creator.silent ? 1 : 0]
        });
        const player = Database.register(post.bidID[0] ? post.bidID[0] : post.creator.id, 'PLR');
        player.write('AHC', [player.has('AHC') ? player.read('AHC') : [], id].flat());
        Database.drop(p, 'AHP');
    });
    //Trying to give people items if nobody accepts it, or delete it
    Database.allTables('AHC').forEach(c => {
        if (hexToNumber(c) > date)
            return;
        const collect = Database.register(c, 'AHC').getCollection(), id = numberToHex(new Date().getTime() + (config.maxHoldTime * 3.6e+6));
        if (!collect.w) {
            Database.drop(collect.d, 'AHI');
            return Database.drop(c, 'AHC');
        }
        const bidder = Database.register(collect.w[0], 'PLR'), db = Database.register(id, 'AHC');
        bidder.write('AHC', bidder.read('AHC').splice(bidder.read('AHC').indexOf(c), 1));
        if (collect.hasOwnProperty('n'))
            db.write('n', collect.n);
        db.writeMany({
            i: collect.i,
            d: collect.d,
            a: collect.a,
            p: collect.p,
            c: collect.c
        });
        const player = Database.register(collect.c[0], 'PLR');
        player.write('AHC', [player.has('AHC') ? player.read('AHC') : [], id].flat());
        Database.drop(c, 'AHC');
    });
}
;
