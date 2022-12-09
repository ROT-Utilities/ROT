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
import { world, Player } from '@minecraft/server';
import { DatabasePaper } from './DatabasePaper';
import quick from '../main.js';
/*
 * Defining possibly arbitrary varibles
*/
const ranksDB = new DatabasePaper('ranks');
/*
 * Welcome to the PlayerPaper!
 * Main Developer: Mo9ses
 * Sub developer: Nobody!
 * Link to name: Player Paper
*/
export class PlayerPaper {
    /**
     * Converts a normal Minecraft player to the ROT paper standard
     * @param {Player | string} player The player you want to transform
     * @param {playerData} data Additional paper data
     * @returns {PlayerType} Don't get this confused with playertype
     */
    paperPlayer(player, data) {
        const plr = player instanceof Player ? player : Array.from(world.getPlayers()).find(p => p.nameTag.toLowerCase() === player.toLowerCase());
        if (!player)
            return;
        if (data?.from)
            data.from = data.from[0].toUpperCase() + data.from.slice(1);
        // @ts-ignore
        const db = new DatabasePaper(plr.id.toString(16).toUpperCase(), 'PLR');
        return Object.assign(player, {
            isAdmin: plr.hasTag(quick.adminTag),
            write: (key, value) => db.write(key, value),
            read: (key) => db.read(key),
            delete: (key) => db.delete(key),
            send: (msg, from) => {
                plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
                plr.tell({ 'rawtext': [{ 'text': `§l§3${from ? `${from} ` : data?.from ? `${data.from} ` : ''}§3>>§r§1 ` }, { 'text': msg }] });
            },
            tip: (msg, from) => {
                plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
                plr.tell({ 'rawtext': [{ 'text': `§l§1${from ? `${from} ` : data?.from ? `${data.from} ` : ''}§aTIP §3>>§r§1 ` }, { 'text': msg }] });
            },
            error: (msg, from) => {
                plr.runCommandAsync('playsound random.glass @s ~~~ 1 0.5');
                plr.tell({ 'rawtext': [{ 'text': `§l§1${from ? `${from} ` : data?.from ? `${data.from} ` : ''}§3Error >>§r§1 ` }, { 'text': msg }] });
            },
            /**
            * @function getRanks Gets the ranks of a player
            * @example getRanks(Mo9ses);
            */
            getPrefixes: () => {
                const ranks = plr.getTags().filter(tag => tag.startsWith('rank:')).map(c => c.replace('rank:', '').trim());
                ranksDB.allKeys().forEach(k => plr.hasTag(ranksDB.read(k).tag) && ranks.push(ranksDB.read(k).prefix));
                return ranks.length ? ranks : [quick.defaultRank];
            },
            /**
            * @function getColors Gets the color of a player
            * @example getColor(Mo9ses);
            */
            getNameColors: () => {
                const colors = plr.getTags().filter(tag => tag.startsWith('colors:')).map(c => c.replace('rank:', '').trim());
                return colors.length ? colors : [quick.defaultNameColor];
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
            veiwBlock: (getBlock) => {
                const l = plr.getBlockFromViewVector({ includeLiquidBlocks: true, maxDistance: 300 });
                return getBlock ? l : [l.x, l.y, l.z];
            },
            veiwEntity: (getPos) => {
                const l = plr.getEntitiesFromViewVector({ maxDistance: 300 });
                return getPos ? [l[0].location.x, l[0].location.y, l[0].location.z] : l;
            },
            // UIerror: (msg: string, buttons: string[], from?: string): boolean => {
            //     const UI = new MessageForm();
            //     let val = false;
            //     UI.setTitle(`${from ?? `§c§l${data.from} Error` ?? '§c§lError!'}`);
            //     UI.setBody(`§c${msg}`);
            //     UI.setButton1(buttons[0] ?? '§e§lTry again');
            //     UI.setButton1(buttons[1] ?? '§c§lClose');
            //     UI.send(plr, res => val = Boolean(res.selection));
            //     return val;
            // },
            // veiwLocation: (dist: [number, number, number]) => { //To be finished
            //     const l = plr.viewVector;
            //     return new Location(l.x, l.y, l.z);
            // },
        });
    }
    /**
     * Used to execute certain functions on players that might be offline or online
     * @param name The name of the player
     * @param from Where this will be used
     * @param player Additional information sent if the player is online
     * @returns {OfflineType}
     */
    offlinePlayer(name, from, player) {
        return {
            nameTag: name,
            // send: (msg: string, frm?: string) => Server.broadcast(msg, name, frm ?? from ?? undefined),
            // error: (msg: string, frm?: string) => Server.broadcast(msg, name, frm ?? from ?? undefined),
        };
    }
}
/*
 * I don't think this is useful...
 */
world.events.playerJoin.subscribe(({ player }) => new DatabasePaper(player.id, 'PLR'));
