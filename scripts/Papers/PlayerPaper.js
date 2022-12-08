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
© Copyright 2022 all rights reserved by Mo9seServer. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docServer.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { world, Player, Location } from '@minecraft/server';
import { DatabasePaper } from './DatabasePaper.js';
import { MessageForm } from './FormPaper.js';
import quick from '../main.js';
const playerData = {}, cache = {};
export class PlayerPaper {
    paperPlayer(player, data) {
        const plr = player instanceof Player ? player : Array.from(world.getPlayers()).find(p => p.nameTag.toLowerCase() === player.toLowerCase());
        if (!player)
            return;
        data.from = data.from[0].toUpperCase() + data.from.slice(1);
        // @ts-ignore
        const db = new DatabasePaper(plr.id.toString(16).toUpperCase(), 'PLR');
        return Object.assign(player, {
            isAdmin: plr.hasTag(quick.adminTag),
            write: (key, value) => {
                Object.assign(cache[plr.nameTag], { [key]: value });
                db.write(key, value);
            },
            read: (key) => cache[plr.nameTag]?.[key] ?? db.read(key),
            delete: (key) => {
                db.delete(key);
                delete cache[plr.nameTag][key];
            },
            send: (msg, from) => {
                plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
                plr.tell({ 'rawtext': [{ 'text': `§l§3${from ? `${from} ` : data.from ? `${data.from} ` : ''}§3>>§r§1 ` }, { 'text': msg }] });
            },
            tip: (msg, from) => {
                plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
                plr.tell({ 'rawtext': [{ 'text': `§l§1${from ? `${from} ` : data.from ? `${data.from} ` : ''}§aTIP §3>>§r§1 ` }, { 'text': msg }] });
            },
            error: (msg, from) => {
                plr.runCommandAsync('playsound random.glass @s ~~~ 1 0.5');
                plr.tell({ 'rawtext': [{ 'text': `§l§1${from ? `${from} ` : data.from ? `${data.from} ` : ''}§3Error >>§r§1 ` }, { 'text': msg }] });
            },
            UIerror: (msg, buttons, from) => {
                const UI = new MessageForm();
                let val = false;
                UI.setTitle(`${from ?? `§c§l${data.from} Error` ?? '§c§lError!'}`);
                UI.setBody(`§c${msg}`);
                UI.setButton1(buttons[0] ?? '§e§lTry again');
                UI.setButton1(buttons[1] ?? '§c§lClose');
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
            hasTags: (tags) => {
                let all = true;
                tags.forEach(t => !plr.hasTag(t) && (all = false));
                return all;
            },
            veiwLocation: (dist) => {
                const l = plr.viewVector;
                return new Location(l.x, l.y, l.z);
            },
            veiwBlock: (getBlock) => {
                const l = plr.getBlockFromViewVector({ includeLiquidBlocks: true, maxDistance: 300 });
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
            // send: (msg: string, frm?: string) => Server.broadcast(msg, name, frm ?? from ?? undefined),
            // error: (msg: string, frm?: string) => Server.broadcast(msg, name, frm ?? from ?? undefined),
        };
    }
}
world.events.playerJoin.subscribe(({ player }) => {
    new DatabasePaper(player.id, 'PLR');
    Object.assign(cache, { [player.name]: { 'default': 0 } });
});
world.events.playerLeave.subscribe(data => delete cache[data.playerName]);
