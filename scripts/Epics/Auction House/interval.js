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
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { system, world } from "@minecraft/server";
import { hexToNumber, numberToHex } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import { AH } from "./main.js";
import Database from "../../Papers/DatabasePaper.js";
import Player from "../../Papers/PlayerPaper.js";
import quick from "../../quick.js";
let color = 0;
const config = quick.epics['Auction House'];
try {
    world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "${config.obj}" dummy`);
}
catch { }
;
system.runInterval(() => {
    if (system.currentTick < 20)
        return;
    if (config.tag.length)
        world.getAllPlayers().forEach(player => {
            if (!player.hasTag(config.tag) || !Player.isConnected(player))
                return;
            player.removeTag(config.tag);
            AH.openAH(Player.playerType(player, { from: config.npcName, sound: false }));
        });
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
    name = '§l' + config.color1 + name.join('');
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
    system.runInterval(() => checkPosts(), config.checkPosts * 20);
export function checkPosts() {
    if (!AH?.client?.AHR)
        return;
    const date = new Date().getTime();
    //Closing old posts
    Database.allTables('AHP').forEach(async (p) => {
        if (hexToNumber(p) > date)
            return;
        const post = await AH.getPost(p), id = numberToHex(new Date().getTime() + (config.maxHoldTime * 3.6e+6));
        ;
        if (!post)
            return;
        const db = await Database.register(id, 'AHC');
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
        const target = post.bidID[0] ? post.bidID[0] : post.creator.id;
        AH.client.update(target, 'AHC', 'add', id);
        Database.drop(p, 'AHP');
    });
    //Trying to give people items if nobody accepts it, or delete it
    Database.allTables('AHC').forEach(async (c) => {
        if (hexToNumber(c) > date)
            return;
        const collect = (await Database.register(c, 'AHC')).getCollection(), id = numberToHex(new Date().getTime() + (config.maxHoldTime * 3.6e+6));
        if (!collect.w?.[0]) {
            Database.drop(collect.d, 'AHI');
            return Database.drop(c, 'AHC');
        }
        AH.client.update(collect.w[0], 'AHC', 'remove', c);
        const db = await Database.register(id, 'AHC');
        if (collect.hasOwnProperty('n'))
            db.write('n', collect.n);
        db.writeMany({
            i: collect.i,
            d: collect.d,
            a: collect.a,
            p: collect.p,
            c: collect.c
        });
        AH.client.update(collect.c[0], 'AHC', 'add', id);
        Database.drop(c, 'AHC');
    });
}
