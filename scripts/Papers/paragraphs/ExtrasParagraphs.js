/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
notbeer (ROT's base code)
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
import { world } from '@minecraft/server';
import { DatabasePaper } from '../DatabasePaper.js';
import { MS } from './ConvertersParagraphs.js';
import config from '../../config.js';
import Server from '../../ServerBook.js';
/**
* Defines:
*/
const tickTimeoutMap = new Map(), tickIntervalMap = new Map(), plots = new DatabasePaper('PL');
let totalTick = 0, tickIntervalID = 0;
world.events.tick.subscribe(() => {
    totalTick++;
    for (const [ID, tickTimeout] of tickTimeoutMap) {
        tickTimeout.tick--;
        if (tickTimeout.tick <= 0) {
            tickTimeout.callback(...tickTimeout.args);
            tickTimeoutMap.delete(ID);
        }
    }
    for (const [, tickInterval] of tickIntervalMap) {
        if (totalTick % tickInterval.tick === 0)
            tickInterval.callback(...tickInterval.args);
    }
});
/**
* Welcome to the ROT's Extras!
* Main Developer: notbeer
* Notes: I don't really know what goes on down here...
* Sub developer: Mo9ses
* Link to name: Miscellaneous
****************************************
* @function getRanks Gets the ranks of a player you
* @param {string} player the player
* @example getRanks(Mo9ses);
*/
export const getRanks = (player) => {
    var _a;
    const ranks = (_a = Array.from(world.getPlayers()).find(n => n.name.toLowerCase() === player.toLowerCase()).getTags()) === null || _a === void 0 ? void 0 : _a.filter(tag => tag.startsWith('rank:'));
    return (ranks === null || ranks === void 0 ? void 0 : ranks[0]) ? ranks.map(c => c.replace('rank:', '').trim()) : [config.defaultRank];
}, 
/**
* @function getColors Gets the color of a player
* @param {string} player the player
* @example getColor(Mo9ses);
*/
getNameColor = (player) => {
    var _a;
    const colors = (_a = Array.from(world.getPlayers()).find(n => n.name.toLowerCase() === player.toLowerCase()).getTags()) === null || _a === void 0 ? void 0 : _a.filter(tag => tag.startsWith('colors:'));
    return (colors === null || colors === void 0 ? void 0 : colors[0]) ? colors.map(c => c.replace('rank:', '').trim()) : [config.defaultNameColor];
}, 
/**
* @function getChat Gets the chat color of a player
* @param {string} player the player
* @example getChat(Mo9ses);
*/
getChat = (player) => { var _a, _b, _c; return config.defaultChatColor + ((_c = (_b = (_a = Array.from(world.getPlayers()).find(n => n.name.toLowerCase() === player.toLowerCase()).getTags()) === null || _a === void 0 ? void 0 : _a.filter(tag => tag.startsWith('chat:'))) === null || _b === void 0 ? void 0 : _b.map(color => color.replace('chat:', '').trim()).join('')) !== null && _c !== void 0 ? _c : ''); }, 
/**
 * @function updateLeaderboard Update the leaderboard of an entity
 * @param {Entity} lb The Minecraft entity
 * @returns {void}
 * @example updateLeaderboard(EntityData);
 */
// updateLeaderboard = (lb: Entity) => {
//     try {
//         let entityName = lb.nameTag.replace(/\n|§/g, ''),
//             objective = lb.getTags().filter(tag => tag.startsWith('ROTLBD:'))[0].replace('ROTLBD:', ''),
//             length = parseInt(lb.getTags().filter(tag => tag.startsWith('ROTLBL:'))[0].replace('ROTLBL:', '')),
//             dataGamertag = entityName.match(/(?<=\$\(obj{gt: ).+?(?=, s: .*?}\))/g),
//             leaderboard = [];
//         if(dataGamertag && lb.nameTag) dataGamertag.map((gamertag: string, index: number) => leaderboard.push({ gamertag, score: parseInt(entityName.match(/(?<=\$\(obj{gt: \D.*, s: ).+?(?=}\))/g)[index].replace(/\D/g, '0')) }));
//         for(const player of new PlayerPaper().list()) {
//             let score = 0;
//             score += new PlayerPaper().getScore(objective, player) ?? 0;
//             const index = leaderboard.findIndex((obj => obj.gamertag === player));
//             if(index !== -1) leaderboard[index].score = score;
//             else leaderboard.push({gamertag: player, score });
//         }
//         leaderboard = [...new Map(leaderboard.map(item => [item['gamertag'], item])).values()].sort((a, b) => b.score - a.score);
//         let leaderboardString = lb.getTags().filter(tag => tag.startsWith('ROTLBH:'))[0]?.replace('ROTLBH:', '') ?? `§4§l${objective.toUpperCase()}§r§c LEADERBOARD\n§r`, saveData = '';
//         for(let i = 0; i < length && i < leaderboard.length; i++) {
//             saveData.replace(new RegExp(`\\$\\(obj{gt: ${leaderboard[i].gamertag}, s: ${leaderboard[i].score}}\\)`, 'g'), '');
//             leaderboardString += `§9${i + 1} §7[${config.coolerChatRanks ? getRanks(leaderboard[i].gamertag) : getRanks(leaderboard[i].gamertag).split('§r§7, ').join('§r§7] [')}] ${getColors(leaderboard[i].gamertag) + leaderboard[i].gamertag} §r§7- §c${metricNumbers(leaderboard[i].score)}§r\n`;
//             saveData += `$(obj{gt: ${leaderboard[i].gamertag}, s: ${leaderboard[i].score}})`;
//         }
//         saveData = saveData ? `§${saveData.replace(/\s*$/, '').split('').join('§')}` : '';
//         lb.nameTag = leaderboardString + saveData;
//     } catch {}
// },
/**
 * Saves all the plots that a members' UUID holds
 * @param {number} playerUUID The ROT UUID of the player
 * @returns {void}
 * @example deletePlot(29223);
 */
savePlot = (playerUUID, plotTag) => {
    var _a, _b;
    return (_b = (_a = plots.allValues()) === null || _a === void 0 ? void 0 : _a.filter(plot => { var _a; return (_a = plotTag === null || plotTag === void 0 ? void 0 : plotTag.includes(plot.tag)) !== null && _a !== void 0 ? _a : true; })) === null || _b === void 0 ? void 0 : _b.forEach(plot => {
        if (!plot.enabled || !plots.has('p-' + plot.id + '-' + playerUUID))
            return;
        const id = plots.read('p-' + plot.id + '-' + playerUUID).id, row = plot.rowSize >= 2 ? ~~(id / plot.rowSize) : 0, coords = plot.distance.map((pos, i) => plot.startingCoords[i] + (row >= 1 ? plot.nextRow[i] * row : 0) + (pos * (id - 1)));
        Server.runCommand(`structure save "${plot.id + '-' + playerUUID}" ${coords.join(' ')} ${coords[0] + plot.savingDistance[0]} ${coords[1] + plot.savingDistance[1]} ${coords[2] + plot.savingDistance[2]} disk`);
    });
}, 
/**
 * Deletes all the plots that a members' UUID holds
 * @param {number} playerUUID The ROT UUID of the player
 * @param {string[]} plotTag The tag of the plot
 * @returns {void}
 * @example deletePlot(09822);
 */
deletePlot = (playerUUID, plotTag) => {
    var _a, _b;
    return (_b = (_a = plots.allValues()) === null || _a === void 0 ? void 0 : _a.filter(plot => { var _a; return (_a = plotTag === null || plotTag === void 0 ? void 0 : plotTag.includes(plot.tag)) !== null && _a !== void 0 ? _a : true; })) === null || _b === void 0 ? void 0 : _b.forEach(plot => {
        if (!plot.enabled || !plots.has('p-' + plot.id + '-' + playerUUID))
            return;
        const id = plots.read('p-' + plot.id + '-' + playerUUID).id, row = plot.rowSize >= 2 ? ~~(id / plot.rowSize) : 0;
        let coords = plot.distance.map((pos, i) => plot.startingCoords[i] + (row >= 1 ? plot.nextRow[i] * row : 0) + (pos * (id - 1)));
        coords.push(coords[0] + plot.savingDistance[0], coords[1] + plot.savingDistance[1], coords[2] + plot.savingDistance[2]);
        Server.runCommand(`tickingarea add ${coords.join(' ')} "ROTplotSystems-${plot.id}-${id}"`);
        const neg = plot.savingDistance[1] < 0 ? true : false, yLevel = Math.abs(coords[1]) + Math.abs(plot.savingDistance[1]);
        for (let l = Math.abs(coords[1]); l <= yLevel; l++)
            Server.runCommand(`fill ${coords[0]} ${neg ? -l : l} ${coords.slice(2, 4).join(' ')} ${neg ? -l : l} ${coords[5]} air 0`);
        if (plot.resetArea)
            Server.runCommand(`structure load ${plot.structure} ` + coords.slice(-3).join(' '));
        Server.runCommand(`tickingarea remove "ROTplotSystems-${plot.id}-${id}"`);
    });
}, 
/**
 * Compare a array of numbers with 2 arrays
 * @param {number[]} XYZa The first set of numbers
 * @param {number[]} XYZb The second set of numbers
 * @param {number[]} XYZc The set of numbers that should between the first and second set of numbers
 * @example betweenXYZ([1, 0, 1], [22, 81, 10], [19, 40, 6]));
 * @returns {boolean}
 */
betweenXYZ = (XYZa, XYZb, XYZc) => XYZc.length === XYZc.filter((c, i) => (c >= Math.min(XYZa[i], XYZb[i])) && (c <= Math.max(XYZa[i], XYZb[i]))).length, 
/**
 * Kick a member from the game using the two step ban protocol
 * @param {Player} player The Minecraft player data
 * @param {object} banData The ban data of the player
 * @example twoStepBan(Server.bans.get('noob'));
 * @returns {void}
 */
twoStepKick = (player, banData) => {
    // @ts-ignore
    if (banData)
        Server.runCommand(`kick "${player.nameTag}" §r\n§cYou have been banned for §a${MS(banData === null || banData === void 0 ? void 0 : banData.time)}§c from this server at §b${banData === null || banData === void 0 ? void 0 : banData.date}${(banData === null || banData === void 0 ? void 0 : banData.reason) ? `\n§7Reason: §r${banData === null || banData === void 0 ? void 0 : banData.reason}` : ''}§7. You will be unbanned in ${MS((banData === null || banData === void 0 ? void 0 : banData.unbanTime) - new Date().getTime())}`);
    player.triggerEvent('ROT:kick');
}, 
/**
 * Caculates the distance from one pos to another and tests if its greater than max
 * @param {Location | BlockLocation} pos1 Either block location, or location
 * @param {Location | BlockLocation} pos2 Either a block location, or location
 * @returns {Boolean} If it was reach
 */
isReach = (pos1, pos2) => Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + (pos1.z - pos2.z) ** 2) > 7, 
/**
 * Delay executing a function, REPEATEDLY
 * @param {string | Function} handler Function you want to execute
 * @param {number} [timeout] Time delay in ticks. 20 ticks is 1 second
 * @param {any[]} args Function parameters for your handler
 * @returns {number}
 */
setTickInterval = (handler, timeout, ...args) => {
    const tickInterval = { callback: handler, tick: timeout, args };
    tickIntervalID++;
    tickIntervalMap.set(tickIntervalID, tickInterval);
    return tickIntervalID;
};
/**
 * Kicks a player
 * @param player player who should be kicked
 * @param message the message that should be show to player
 * @param onFail this needs to be used for loops to unregister
 */
export const kick = (player, message = [], onFail) => {
    try {
        player.runCommand(`kick @s §r${message.join("\n")}`);
        player.triggerEvent("ROT:kick");
    }
    catch (error) {
        player.triggerEvent("ROT:kick");
        if (!/"statusCode":-2147352576/.test(error))
            return;
        // This function just tried to kick the owner
        if (onFail)
            onFail();
    }
};
