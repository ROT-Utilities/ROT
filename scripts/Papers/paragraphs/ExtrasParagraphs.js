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
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { world, system } from '@minecraft/server';
import { MessageForm } from '../FormPaper';
/**
* Defines:
*/
const tickTimeoutMap = new Map(), tickIntervalMap = new Map();
let totalTick = 0, tickIntervalID = 0, tickTimeoutID = 0;
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
}, 
/**
 * Delay executing a function
 * @param {string | Function} handler Function you want to execute
 * @param {number} [timeout] Time delay in ticks. 20 ticks is 1 second
 * @param {any[]} args Function parameters for your handler
 * @returns {number}
 */
setTickTimeout = (handler, timeout, ...args) => {
    const tickTimeout = { callback: handler, tick: timeout, args };
    tickTimeoutID++;
    tickIntervalMap.set(tickTimeoutID, tickTimeout);
    return tickTimeoutID;
}, 
/**
 * Confirm or cancel an action
 * @param {PlayerType} player Player you want to send the confirm action
 * @param {string} body Body message
 * @param {string} title title message
 * @param {(res: simpleFormResponse) => void} onAccept function to execute when the player confirms
 * @param {(res: simpleFormResponse) => void} onCancel function to execute when the player cancels
 */
confirmAction = (player, body, title, onAccept, onCancel) => {
    const form = new MessageForm();
    form.setTitle(title ?? 'CONFIRM ACTION');
    form.setBody(body);
    form.setButton1('CONFIRM');
    form.setButton2('CANCEL');
    form.send(player, (res) => {
        if (!res.selection)
            return onCancel ? onCancel(res) : false;
        return onAccept(res);
    });
}, 
/**
 * Stop the code for a certain amount of time
 * @param {number} ticks How long do you want the code to stop in ```ticks```
 */
sleep = (ticks) => {
    return new Promise((resolve) => {
        const id = system.runSchedule(() => {
            resolve();
            system.clearRunSchedule(id);
        }, ticks);
    });
}, 
/**
 * Get facing direction
 */
compass = (angle) => {
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
};
/**
 * GET RANDOM DIGIT ID
 */
export const ID = () => new Date().getTime() - 16000000000;
