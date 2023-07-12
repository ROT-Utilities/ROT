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
import { connected } from "../../Tales/playerConnect.js";
import { fac } from "./main.js";
import Database from "../../Papers/DatabasePaper.js";
import Player from "../../Papers/PlayerPaper.js";
import quick from "../../quick.js";
const config = quick.epics.Factions;
system.runInterval(() => world.getAllPlayers().forEach(async (plr) => {
    if (!Player.isConnected(plr) || !fac.player)
        return;
    if (!fac.player.has(connected[plr.name]?.rID))
        return;
    const score = Player.getScore(plr, quick.epics.Factions.powerObj), memory = Player.memory(plr);
    if (!memory.has('FTN'))
        return memory.write('FTN', score);
    if (score === memory.read('FTN'))
        return;
    memory.write('FTN', score);
    const db = await Database.register(fac.player.read(connected[plr.name].rID, true), 'FTN'), user = db.read(`u${fac.playerI.read(connected[plr.name].rID)}`), newP = db.allKeys().filter(key => key.startsWith('u'));
    db.write(`u${fac.playerI.read(connected[plr.name].rID)}`, [connected[plr.name].rID, plr.name, user[2], score, user[4]]);
    fac.power.write(db.read('n'), parseInt(`${newP.map(u => db.read(`u${u.replace('u', '')}`)[3]).reduce((a, b) => a + b, 0) / newP.length}`));
}), 60);
system.runInterval(() => world.getAllPlayers().forEach(plr => {
    if (system.currentTick < 100)
        return;
    const memory = Player.memory(plr);
    if (Date.now() < memory.read('FTNtimer'))
        return;
    memory.write('FTNtimer', Date.now() + 3600000);
    const power = Player.getScore(plr, config.powerObj);
    if (config.maxPower && config.maxPower <= power)
        return;
    let nPower = power + config.powerHour;
    if (config.maxPower && (nPower > config.maxPower))
        nPower = config.maxPower;
    plr.runCommandAsync(`scoreboard players set @s "${config.powerObj}" ${nPower}`);
    plr.sendMessage(`§a§l+${nPower - power} power`);
}), 300);
