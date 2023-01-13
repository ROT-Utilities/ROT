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
© Copyright 2023 all rights reserved by Mo9seServer. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docServer.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { world, Player as IPlayer, Location } from '@minecraft/server';
import { joined } from '../Tales/playerConnect.js';
import Database from './DatabasePaper.js';
import quick from '../main.js';
/*
 * Welcome to the PlayerPaper!
 * Main Developer: Mo9ses
 * Sub developer: Nobody!
 * Link to name: Player Paper
*/
const ranksDB = Database.register('ranks');
class PlayerPaper {
    send(plr, msg, frm, sund) {
        if (sund)
            plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
        plr.tell({ 'rawtext': [{ 'text': `§l§6${frm ? `${frm} ` : ''}§6>>§r§e ` }, { 'text': msg }] }); //§r
    }
    error(plr, msg, frm, sund) {
        if (sund)
            plr.runCommandAsync('playsound mob.zombie.woodbreak @s ~~~ 1 1');
        plr.tell({ 'rawtext': [{ 'text': `§l§e${frm ? `${frm} ` : ''}§6Error >>§r§e ` }, { 'text': msg }] }); //§r
    }
    getPrefixes(plr) {
        const ranks = plr.getTags().filter(tag => tag.startsWith('rank:')).map(c => c.replace('rank:', '').trim());
        ranksDB.allKeys().forEach(k => plr.hasTag(ranksDB.read(k).tag) && ranks.push(ranksDB.read(k).prefix));
        return ranks.length ? ranks : [quick.defaultRank];
    }
    getNameColors(plr) {
        const colors = plr.getTags().filter(tag => tag.startsWith('color:')).map(c => c.replace('color:', '').trim());
        return colors.length ? colors : [quick.defaultNameColor];
    }
    getNameColor(plr) {
        const colors = plr.getTags().filter(tag => tag.startsWith('color:')).map(c => c.replace('color:', '').trim());
        return `${(colors.length ? colors : [quick.defaultNameColor]).join('')}${plr.nameTag}`;
    }
    getScore(plr, obj) {
        return world.scoreboard.getObjective(obj)?.getScore(plr.scoreboard) ?? 0;
    }
    getByID(id, data) {
        return this.playerType(world.getAllPlayers().find(p => p.id === id), data);
    }
    /**
     * Converts a normal Minecraft player to the ROT paper standard
     * @param {Player | string} player The player you want to transform
     * @param {playerData} data Additional paper data
     * @returns {PlayerType} Don't get this confused with playertype
     */
    playerType(player, data) {
        const plr = player instanceof IPlayer ? player : Array.from(world.getPlayers()).find(p => p?.name.toLowerCase() === player?.toLowerCase());
        if (!plr)
            return;
        let sound = true;
        if (data?.hasOwnProperty('sound'))
            sound = false;
        if (data?.from)
            data.from = data.from[0].toUpperCase() + data.from.slice(1);
        const db = Database.register(plr.id, 'PLR');
        return Object.assign(player, {
            isAdmin: plr.isOp(),
            write: (key, value) => db.write(key, value),
            read: (key) => db.read(key),
            has: (key) => db.has(key),
            delete: (key) => db.delete(key),
            send: (msg, frm, sund) => this.send(plr, msg, frm ?? data?.from ?? undefined, sund ?? sound),
            tip: (msg, frm, sund) => {
                if (sund ?? sound)
                    plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
                plr.tell({ 'rawtext': [{ 'text': `§l§e${frm ? `${frm} ` : data?.from ? `${data.from} ` : ''}§aTIP §6>>§r§e ` }, { 'text': msg }] }); //§r
            },
            error: (msg, frm, sund) => this.error(plr, msg, frm ?? data?.from ?? undefined, sund ?? sound),
            /**
            * getRanks Gets the ranks of a player
            * @example .getPrefixes();
            */
            getPrefixes: () => this.getPrefixes(plr),
            /**
            * Gets the name colors of a player
            * @example .getNameColors();
            */
            getNameColors: () => this.getNameColors(plr),
            /**
            * Gets the name color of a player
            * @example .getNameColor();
            */
            getNameColor: () => this.getNameColor(plr),
            /**
             * Get player's score on a specific objective
             * @param {string} obj Objective name you want to search
             * @example .getScore('Money');
             */
            getScore: (obj) => this.getScore(plr, obj),
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
            toLocation: () => new Location(plr.location.x, plr.location.y, plr.location.z)
        });
    }
    /**
     * Used to execute certain functions on players that might be offline or online
     * @param name The name of the player
     * @param from Where this will be used
     * @param player Additional information that can be used to try to find the player
     * @returns {OfflineType}
     */
    offlinePlayer(name, from, player) {
        const plr = player instanceof String ? Array.from(world.getPlayers()).find(p => p.nameTag.toLowerCase() === player?.toLowerCase() || p.nameTag.toLowerCase() === name.toLowerCase()) : player;
        const db = joined[name] && Database.register(joined[name][0], 'PLR');
        return {
            nameTag: name,
            player: this.playerType(player ?? name),
            database: db,
            write: (key, value) => db && db.write(key, value),
            read: (key) => db && db.read(key),
            has: (key) => db && db.has(key),
            delete: (key) => db && db.delete(key),
            send: (msg, frm) => {
                plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
                plr.tell({ 'rawtext': [{ 'text': `§l§6${frm ? `${frm} ` : from ? `${from} ` : ''}§6>>§r§e ` }, { 'text': msg }] }); //§r
            },
            tip: (msg, frm) => {
                plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
                plr.tell({ 'rawtext': [{ 'text': `§l§e${frm ? `${frm} ` : from ? `${from} ` : ''}§6TIP §a>>§r§e ` }, { 'text': msg }] }); //§r
            },
            error: (msg, frm) => {
                plr.runCommandAsync('playsound random.glass @s ~~~ 1 0.5');
                plr.tell({ 'rawtext': [{ 'text': `§l§e${frm ? `${frm} ` : from ? `${from} ` : ''}§6Error >>§r§e ` }, { 'text': msg }] }); //§r
            },
        };
    }
}
const Player = new PlayerPaper();
export default Player;
