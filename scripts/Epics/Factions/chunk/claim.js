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
import { connected } from "../../../Tales/playerConnect.js";
import { has } from "../faction.js";
import { fac } from "../main.js";
import Player from "../../../Papers/PlayerPaper.js";
import quick from "../../../quick.js";
import Database from "../../../Papers/DatabasePaper.js";
import Server from "../../../Papers/ServerPaper.js";
const config = quick.epics.Factions;
/**
 * Gets the location of the player's current
 * @param {IPlayer} player The player
 * @returns {[number, number]}
 */
export function getChunk(player) {
    return [~~((player.location.x + 1) / 16), ~~((player.location.z + 1) / 16)];
}
/**
 * Get the faction IDs of the owners of the chunks
 * @param {m} chunks The chunk(s)
 * @returns {string | string[]}
 */
export function getOwner(chunks) {
    const owners = (typeof chunks[0] === 'number' ? [chunks] : chunks).flatMap(c => fac.chunks.has(`${c[0]}_${c[1]}`) ? `${fac.player.read(fac.chunks.read(`${c[0]}_${c[1]}`))}` : null);
    return owners.length === 1 ? owners[0] : owners;
}
/**
 * Check if a player is in a claim
 * @param {IPlayer} player The player
 * @returns {boolean}
 */
export function inClaim(player) {
    return fac.chunks.has(`${~~((player.location.x + 1) / 16)}_${~~((player.location.y + 1) / 16)}`);
}
/**
 * Claim chunk
 * @param player
 * @returns {void}
 */
export async function claimChunk(player) {
    const spawn = Server.db.read('spawn');
    if (spawn?.length && Array.from(player.dimension.getEntities({ type: 'minecraft:player', location: { x: spawn[0], y: spawn[1], z: spawn[2] }, maxDistance: config.radius })).some(p => p.id === player.id))
        return player.error(`You have to be further than §c${config.radius}§e blocks from spawn.`);
    if (spawn?.length && !Array.from(player.dimension.getEntities({ type: 'minecraft:player', location: { x: spawn[0], y: spawn[1], z: spawn[2] }, maxDistance: config.maxRadius })).some(p => p.id === player.id))
        return player.error(`You have to be within §c${config.maxRadius}§e blocks from spawn.`);
    if (!has({ player: player }))
        return Player.error(player, 'You aren\'t even in a faction!');
    const db = await Database.register(fac.player.read(player.rID, true), 'FTN'), power = player.getScore(config.powerObj);
    //Check if faction power is over powerForClaimLand
    if (fac.power.read(db.read('n')) < config.minFacClaimLand)
        return player.send(`Your faction doesn't have the required average power. You have §6${fac.power.read(db.read('n'))} §epower, §6${config.minFacClaimLand} §epower is required.`);
    if (power < config.minClaimLand)
        return player.send(`You don't have enough power. You have §6${power} §epower, §6${config.minClaimLand} §epower is required.`);
    const chunk = getChunk(player);
    if (chunk[0] === 0 || chunk[1] === 0)
        return player.error('You cannot claim chunks near §c0§e, §c0§e.');
    const ownerID = getOwner(chunk);
    if (ownerID === fac.player.read(player.rID, true))
        return player.error('Your faction already has this chunk claimed.');
    if (!ownerID) {
        fac.chunks.write(`${chunk[0]}_${chunk[1]}`, Number(player.rID));
        player.send(`You have succesfully claimed a chunk at §6${chunk[0]}, ${chunk[1]}§e!${config.claimCost ? `\nYou lost §a${config.claimCost}§e power.` : ''}`);
    }
    else {
        const ownerDB = (await Database.register(ownerID, 'FTN'));
        if (config.mostPowerClaims && fac.power.read(ownerDB.read('n')) > fac.power.read(db.read('n')))
            return player.send('You do not have enough power to overwrite this faction\'s claim.');
        if (!config.mostPowerClaims && fac.power.read(ownerDB.read('n')) >= config.minFacClaimLand)
            return player.send('This faction\'s power isn\'t weak enough yet.');
        fac.playerC.write(fac.chunks.read(`${chunk[0]}_${chunk[1]}`), fac.playerC.read(fac.chunks.read(`${chunk[0]}_${chunk[1]}`)) - 1);
        fac.chunks.write(`${chunk[0]}_${chunk[1]}`, Number(player.rID));
        const occ = ownerDB.read('cc');
        occ.splice(occ.indexOf(chunk), 1);
        ownerDB.write('cc', occ);
        player.send(`Watch out! You have stolen §6${ownerDB.read('n')}'s §eclaim at §6${chunk[0]}, ${chunk[1]}§e and they have been alerted!`);
        world.getAllPlayers().forEach(p => String(fac.player.read(connected[p.name].rID)) === ownerID && Player.send(p, `Alert! Someone stole your one of your faction\'s claims at §6${chunk[0]}, ${chunk[1]}§e!`));
    }
    player.runCommandAsync(`scoreboard players remove @s "${config.powerObj}" ${config.claimCost}`);
    fac.playerC.write(player.rID, (fac.playerC.has(player.rID) ? fac.playerC.read(player.rID) : 0) + 1);
    const cc = db.read('cc');
    cc.push(chunk);
    db.write('cc', cc);
}
export function showBorder(player, chunks, y, check) {
    let claims = (typeof chunks[0] === 'number' ? [chunks] : chunks).filter(c => check ? fac.chunks.has(`${c[0]}_${c[1]}`) : true);
    claims.forEach(c => system.run(() => player.dimension.spawnEntity('rot:chunk', { x: 16 * c[0] + (Math.abs(c[0]) === c[0] ? 7 : -7), y: player.location.y <= y ? player.location.y : y + 1, z: 16 * c[1] + (Math.abs(c[1]) === c[1] ? 7 : -7) })));
}
