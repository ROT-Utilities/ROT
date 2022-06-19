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
import { world } from 'mojang-minecraft';
import { PlayerPaper } from '../PlayerPaper.js';
import { DatabasePaper } from '../DatabasePaper.js';
import { metricNumbers, MS } from './ConvertersParagraphs.js';
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
    const ranks = new PlayerPaper().getTags(player)?.filter(tag => tag.startsWith('rank:'));
    return (ranks?.[0] ? ranks.map(rank => rank.replace('rank:', '').trim()).join('§r§7, ') : config.defaultRank) + '§r§7';
}, 
/**
* @function getColors Gets the color of a player
* @param {string} player the player
* @example getColor(Mo9ses);
*/
getColors = (player) => config.defaultNameColor + (new PlayerPaper().getTags(player)?.filter(tag => tag.startsWith('color:'))?.map(color => color.replace('color:', '').trim()).join('') ?? ''), 
/**
* @function getChat Gets the chat color of a player
* @param {string} player the player
* @example getChat(Mo9ses);
*/
getChat = (player) => config.defaultChatColor + (new PlayerPaper().getTags(player)?.filter(tag => tag.startsWith('chat:'))?.map(color => color.replace('chat:', '').trim()).join('') ?? ''), 
/**
 * @function updateLeaderboard Update the leaderboard of an entity
 * @param {Entity} lb The Minecraft entity
 * @returns {void}
 * @example updateLeaderboard(EntityData);
 */
updateLeaderboard = (lb) => {
    try {
        let entityName = lb.nameTag.replace(/\n|§/g, ''), objective = lb.getTags().filter(tag => tag.startsWith('ROTLBD:'))[0].replace('ROTLBD:', ''), length = parseInt(lb.getTags().filter(tag => tag.startsWith('ROTLBL:'))[0].replace('ROTLBL:', '')), dataGamertag = entityName.match(/(?<=\$\(obj{gt: ).+?(?=, s: .*?}\))/g), leaderboard = [];
        if (dataGamertag && lb.nameTag)
            dataGamertag.map((gamertag, index) => leaderboard.push({ gamertag, score: parseInt(entityName.match(/(?<=\$\(obj{gt: \D.*, s: ).+?(?=}\))/g)[index].replace(/\D/g, '0')) }));
        for (const player of new PlayerPaper().list()) {
            let score = 0;
            score += new PlayerPaper().getScore(objective, player) ?? 0;
            const index = leaderboard.findIndex((obj => obj.gamertag === player));
            if (index !== -1)
                leaderboard[index].score = score;
            else
                leaderboard.push({ gamertag: player, score });
        }
        leaderboard = [...new Map(leaderboard.map(item => [item['gamertag'], item])).values()].sort((a, b) => b.score - a.score);
        let leaderboardString = lb.getTags().filter(tag => tag.startsWith('ROTLBH:'))[0]?.replace('ROTLBH:', '') ?? `§4§l${objective.toUpperCase()}§r§c LEADERBOARD\n§r`, saveData = '';
        for (let i = 0; i < length && i < leaderboard.length; i++) {
            saveData.replace(new RegExp(`\\$\\(obj{gt: ${leaderboard[i].gamertag}, s: ${leaderboard[i].score}}\\)`, 'g'), '');
            leaderboardString += `§9${i + 1} §7[${config.coolerChatRanks ? getRanks(leaderboard[i].gamertag) : getRanks(leaderboard[i].gamertag).split('§r§7, ').join('§r§7] [')}] ${getColors(leaderboard[i].gamertag) + leaderboard[i].gamertag} §r§7- §c${metricNumbers(leaderboard[i].score)}§r\n`;
            saveData += `$(obj{gt: ${leaderboard[i].gamertag}, s: ${leaderboard[i].score}})`;
        }
        saveData = saveData ? `§${saveData.replace(/\s*$/, '').split('').join('§')}` : '';
        lb.nameTag = leaderboardString + saveData;
    }
    catch { }
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
    if (banData)
        Server.runCommand(`kick "${player.nameTag}" §r\n§cYou have been banned for §a${MS(banData?.length)}§c from this server at §b${banData?.date}${banData?.reason ? `\n§7Reason: §r${banData?.reason}` : ''}§7. You will be unbanned in ${MS(banData?.unbanTime - new Date().getTime())}`);
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
