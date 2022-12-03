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
© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { world, Player, BlockRaycastOptions, Location } from '@minecraft/server';
import { DatabasePaper } from './DatabasePaper.js';
import quick from './DatabasePaper.js';
import { MessageForm } from './FormPaper.js';
import { ServerPaper } from './ServerPaper.js';
const playerData = {}, cache = {}, s = new ServerPaper();
export class PlayerPaper {
    paperPlayer(player, data) {
        const plr = player instanceof Player ? player : Array.from(world.getPlayers()).find(p => p.nameTag.toLowerCase() === player.toLowerCase());
        if (!player)
            return;
        // @ts-ignore parseInt(hexString, 16);
        const db = new DatabasePaper(player.id.toString(16).toUpperCase(), 'PLR');
        return Object.assign(player, {
            isAdmin: plr.hasTag(quick.adminTag),
            write: (key, value, memoryKey) => {
                Object.assign(cache[plr.nameTag], { [key]: value });
                db.write(key, value, memoryKey);
            },
            read: (key) => { var _a, _b; return (_b = (_a = cache[plr.nameTag]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : db.read(key); },
            delete: (key) => {
                db.delete(key);
                delete cache[plr.nameTag][key];
            },
            send: (msg, from) => {
                var _a;
                s.broadcast(msg, plr.nameTag, (_a = from !== null && from !== void 0 ? from : data.from) !== null && _a !== void 0 ? _a : undefined);
            },
            error: (msg, from) => {
                var _a;
                s.eBroadcast(msg, plr.nameTag, (_a = from !== null && from !== void 0 ? from : data.from) !== null && _a !== void 0 ? _a : undefined);
            },
            UIerror: (msg, buttons, from) => {
                var _a, _b, _c;
                const UI = new MessageForm();
                let val = false;
                UI.setTitle(`${(_a = from !== null && from !== void 0 ? from : `§c§l${data.from} Error`) !== null && _a !== void 0 ? _a : '§c§lError!'}`);
                UI.setBody(`§c${msg}`);
                UI.setButton1((_b = buttons[0]) !== null && _b !== void 0 ? _b : '§e§lTry again');
                UI.setButton1((_c = buttons[1]) !== null && _c !== void 0 ? _c : '§c§lClose');
                UI.send(plr, res => val = Boolean(res.selection));
                return val;
            },
            /**
             * Get players score on a specific objective
             * @param {string} obj Objective name you want to search
             * @example .getScore('Money');
             */
            getScore: (obj) => {
                return world.scoreboard.getObjective(obj).getScore(plr.scoreboard);
            },
            veiwLocation: (dist) => {
                const l = plr.viewVector;
                return new Location(l.x, l.y, l.z);
            },
            veiwBlock: (getBlock) => {
                const r = new BlockRaycastOptions();
                r.includeLiquidBlocks = true;
                r.maxDistance = 300;
                const l = plr.getBlockFromViewVector(r);
                return getBlock ? l : [l.x, l.y, l.z];
            },
            veiwEntity: (getPos) => {
                const l = plr.getEntitiesFromViewVector({ maxDistance: 300 });
                return getPos ? [l[0].location.x, l[0].location.y, l[0].location.z] : l;
            }
        });
    }
    offlinePlayer(name, from, player) {
        return {
            nameTag: name,
            send: (msg, frm) => { var _a; return s.broadcast(msg, name, (_a = frm !== null && frm !== void 0 ? frm : from) !== null && _a !== void 0 ? _a : undefined); },
            error: (msg, frm) => { var _a; return s.broadcast(msg, name, (_a = frm !== null && frm !== void 0 ? frm : from) !== null && _a !== void 0 ? _a : undefined); },
        };
    }
}
world.events.playerJoin.subscribe(({ player }) => {
    new DatabasePaper(player.id, 'PLR');
    Object.assign(cache, { [player.name]: { 'default': 0 } });
});
world.events.playerLeave.subscribe(data => delete cache[data.playerName]);
