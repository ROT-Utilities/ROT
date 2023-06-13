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
Docs: https://docServer.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { world, Player as IPlayer, GameMode } from '@minecraft/server';
import { connected } from '../Tales/playerConnect.js';
import Database from './DatabasePaper.js';
import quick from '../quick.js';
/*
 * Welcome to the PlayerPaper!
 * Main Developer: Mo9ses
 * Sub developer: Nobody!
 * Link to name: Player Paper
*/
class PlayerPaper {
    /**
     * Converts a normal Minecraft player to the ROT paper standard
     * @param {Player | string} player The player you want to transform
     * @param {playerData} data Additional paper data
     * @returns {PlayerType} Don't get this confused with playertype
     */
    playerType(player, data) {
        const plr = player instanceof IPlayer ? player : world.getAllPlayers().find(p => p?.name.toLowerCase() === player?.toLowerCase());
        if (!plr || !connected.hasOwnProperty(plr.name))
            return;
        let sound = true;
        if (data?.hasOwnProperty('sound'))
            sound = false;
        if (data?.from)
            data.from = data.from[0].toUpperCase() + data.from.slice(1);
        return Object.assign(player, {
            from: data?.from,
            isAdmin: this.isAdmin(plr),
            memory: this.memory(plr),
            rID: connected[plr.name].rID,
            send: (msg, frm, sund) => this.send(plr, msg, frm ?? data?.from ?? undefined, sund ?? sound),
            tip: (msg, frm, sund) => {
                if (sund ?? sound)
                    plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
                plr.sendMessage({ 'rawtext': [{ 'text': `§l§e${frm ? `${frm} ` : data?.from ? `${data.from} ` : ''}§aTIP §6>>§r§e ` }, { 'text': msg }] }); //§r
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
            setScore: (obj, num) => this.setScore(plr, obj, num),
            hasTags: (tags) => {
                let all = true;
                tags.forEach(t => !plr.hasTag(t) && (all = false));
                return all;
            },
            veiwBlock: (getBlock) => this.veiwBlock(plr, getBlock),
            veiwEntity: (getPos) => {
                const l = plr.getEntitiesFromViewDirection({ maxDistance: 300 });
                return getPos ? [l[0].location.x, l[0].location.y, l[0].location.z] : l;
            },
            toLocation: () => { return { x: plr.location.x, y: plr.location.y, z: plr.location.z }; }
        });
    }
    /**
     * Checks if the player is admin
     * @param {IPlayer} plr The player
     * @returns {boolean}
     */
    isAdmin(plr) {
        return plr.hasTag(quick.adminTag);
    }
    memory(plr) {
        return {
            write: (key, value) => connected[plr.name].memory[key] = value,
            read: (key) => connected[plr.name].memory?.[key],
            has: (key) => Boolean(connected[plr.name].memory?.[key]),
            release: (key) => delete connected[plr.name].memory?.[key]
        };
    }
    send(plr, msg, frm, sund) {
        if (sund)
            plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
        plr.sendMessage({ 'rawtext': [{ 'text': `§l§6${frm ? `${frm} ` : ''}§6>>§r§e ` }, { 'text': msg }] }); //§r
    }
    error(plr, msg, frm, sund) {
        if (sund)
            plr.runCommandAsync('playsound mob.zombie.woodbreak @s ~~~ 1 1');
        plr.sendMessage({ 'rawtext': [{ 'text': `§l§e${frm ? `${frm} ` : ''}§6Error >>§r§e ` }, { 'text': msg }] }); //§r
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
        return `${(colors.length ? colors : [quick.defaultNameColor]).join('')}${plr.name}`;
    }
    getScore(plr, obj) {
        try {
            const score = world.scoreboard.getObjective(obj)?.getScore(plr.scoreboardIdentity);
            return score ?? 0;
        }
        catch {
            return 0;
        }
    }
    setScore(plr, obj, num) {
        try {
            plr.runCommandAsync(`scoreboard players set @s "${obj}" ${num}`);
            return true;
        }
        catch (e) {
            console.warn(e);
            return false;
        }
    }
    getGamemode(player) {
        return Object.values(GameMode).find(m => Array.from(player.dimension.getEntities({ name: player.name, gameMode: m, type: 'minecraft:player' }))[0]);
    }
    getBy({ id, name }, typeData) {
        if (id)
            return this.playerType(world.getAllPlayers().find(p => String(Player.getScore(p, 'PLRid')) === id), typeData);
        if (name)
            return this.playerType(world.getAllPlayers().find(p => p?.name.toLowerCase() === name?.toLowerCase()), typeData);
    }
    veiwBlock(player, getBlock) {
        const l = player.getBlockFromViewDirection({ includeLiquidBlocks: true, maxDistance: 300 });
        return getBlock ? l : { x: l.x, y: l.y, z: l.z };
    }
    /**
     * Used to execute certain functions on players that might be offline or online
     * @param name The name of the player
     * @param from Where this will be used
     * @param player Additional information that can be used to try to find the player
     * @returns {OfflineType}
     */
    offlinePlayer(name, from, player) {
        const plr = player instanceof String ? Array.from(world.getPlayers()).find(p => p.name.toLowerCase() === player?.toLowerCase() || p.name.toLowerCase() === name.toLowerCase()) : player;
        return {
            name: name,
            memory: this.memory(plr),
            player: this.playerType(player ?? name),
            rID: connected[name]?.rID,
            send: (msg, frm) => {
                plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
                plr.sendMessage({ 'rawtext': [{ 'text': `§l§6${frm ? `${frm} ` : from ? `${from} ` : ''}§6>>§r§e ` }, { 'text': msg }] });
            },
            tip: (msg, frm) => {
                plr.runCommandAsync('playsound random.toast @s ~~~ 1 0.5');
                plr.sendMessage({ 'rawtext': [{ 'text': `§l§e${frm ? `${frm} ` : from ? `${from} ` : ''}§6TIP §a>>§r§e ` }, { 'text': msg }] });
            },
            error: (msg, frm) => {
                plr.runCommandAsync('playsound random.glass @s ~~~ 1 0.5');
                plr.sendMessage({ 'rawtext': [{ 'text': `§l§e${frm ? `${frm} ` : from ? `${from} ` : ''}§6Error >>§r§e ` }, { 'text': msg }] });
            },
        };
    }
}
const Player = new PlayerPaper();
export default Player;
let ranksDB;
(async function () {
    ranksDB = await Database.register('ranks');
})();
