/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer)
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
import { system } from '@minecraft/server';
import { MessageForm } from '../FormPaper.js';
/**
* Defines:
*/
const tickTimeoutMap = new Map(), tickIntervalMap = new Map();
let totalTick = 0, tickIntervalID = 0;
system.runInterval(() => {
    totalTick++;
    for (const [ID, tickTimeout] of tickTimeoutMap) {
        tickTimeout.tick--;
        if (tickTimeout.tick <= 0) {
            tickTimeout.callback(...tickTimeout.args);
            tickTimeoutMap.delete(ID);
        }
    }
    for (const [, tickInterval] of tickIntervalMap)
        if (totalTick % tickInterval.tick === 0)
            tickInterval.callback(...tickInterval.args);
}, 1);
/**
* Welcome to the ROT's Extras!
* Main Developer: Mo9ses
* Notes: I don't really know what goes on down here...
* Sub developer: Nobody!
* Link to name: Miscellaneous
*/
export const 
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
 * Caculates the distance from one pos to another and tests if its greater than max
 * @param {Location} pos1 Either block location, or location
 * @param {Location} pos2 Either a block location, or location
 * @returns {Boolean} If it was reach
 */
isReach = (pos1, pos2) => Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + (pos1.z - pos2.z) ** 2) > 7, 
/**
 * GET RANDOM DIGIT ID
 */
ID = () => `${new Date().getTime()}`.split('').reverse().slice(0, 9).join('').replace(/0/, `${~~(Math.random() * 9)}`);
/**
 * Delay executing a function, REPEATEDLY
 * @param {string | Function} handler Function you want to execute
 * @param {number} [timeout] Time delay in ticks. 20 ticks is 1 second
 * @param {any[]} args Function parameters for your handler
 * @returns {number}
 */
export function setTickInterval(handler, timeout, firstTick, ...args) {
    const tickInterval = { callback: handler, tick: timeout, args };
    tickIntervalID++;
    tickIntervalMap.set(tickIntervalID, tickInterval);
    if (firstTick ?? true)
        try {
            handler(0);
        }
        catch (e) {
            console.warn(e + e.stack);
        }
    return tickIntervalID;
}
/**
 * Creates a conformation screen
 * @param {PlayerType} player The player you want to open the form for
 * @param {string} title The title of the form
 * @param {string} body The body
 * @param {string} yes The accept button
 * @param {string} no The decline button
 * @returns {Promise<boolean>} remember to use async
 */
export async function confirmForm(player, title, body, yes, no) {
    let confirm = false;
    const c = new MessageForm();
    c.setTitle(title);
    c.setBody(body);
    c.setButton1(yes ?? '§aSure!§r');
    c.setButton2(no ?? '§cNah...§r');
    await c.send(player, res => confirm = Boolean(res.selection));
    return confirm;
}
/**
 * Stop the code for a certain amount of time
 * @param {number} ticks How long do you want the code to stop in ```ticks```
 */
export async function sleep(ticks, callback) {
    return new Promise((resolve) => {
        const id = system.runInterval(() => {
            resolve();
            system.clearRun(id);
            if (callback)
                callback();
        }, ticks);
    });
}
/**
 * Get the direction the player is facing
 * @param angle The angle (-180 to 180)
 * @returns {string}
 */
export function compass(angle) {
    let face = '';
    if (Math.abs(angle) > 112.5)
        face += 'North ';
    if (Math.abs(angle) < 67.5)
        face += 'South ';
    if (angle < 157.5 && angle > 22.5)
        face += 'West';
    if (angle > -157.5 && angle < -22.5)
        face += 'East';
    return face.trim();
}
