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
import { world } from '@minecraft/server';
import { MS } from '../../Papers/Paragraphs/ConvertersParagraphs.js';
import { createFaction, deleteFaction, get, getRole, has } from './faction.js';
import { claimChunk, getChunk, getOwner } from './chunk/claim.js';
import { connected } from '../../Tales/playerConnect.js';
import { AsciiMap } from './AsciiMap.js';
import { fac } from './main.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import Player from '../../Papers/PlayerPaper.js';
import Server from '../../Papers/ServerPaper.js';
import quick from '../../quick.js';
const config = quick.epics.Factions;
const cmd = Commands.create({
    name: 'f',
    description: 'Factions commands!',
    aliases: ['ftn', 'fac', 'faction', 'factions'],
    category: 'Epics',
    developers: ['Mo9ses', 'Aex66']
});
cmd.startingArgs(['create', 'delete', 'claim', 'set', 'home', 'info', 'members', 'invite', 'join', 'kick', 'leave', 'top', 'nearby', 'deposit', 'withdraw']);
cmd.staticType('create', 'create', (plr, name) => createFaction(plr, name));
cmd.staticType('delete', 'remove', (plr, _, args) => {
    const name = fac.names.find(fac.player.read(plr.rID));
    if (args[0]?.[0] !== name)
        return plr.send(`Please type your faction's name (k sensitive) at the end to confirm removal. `);
    deleteFaction(plr);
}, 'any', false, false);
cmd.dynamicType('claim', 'claim', plr => claimChunk(plr));
cmd.bridge('set', 'set', ['set:home', 'set:description', 'set:permissions'], plr => {
    if (has({ player: plr }))
        return;
    plr.error('You aren\'t even in a faction!');
    cmd.end();
});
cmd.dynamicType('set:home', ['home', 'h', 'spawn', 's'], async (plr) => {
    const db = await Database.register(fac.player.read(plr.rID, true), 'FTN'), spawn = Server.db.read('spawn');
    ;
    if (await getRole(plr, db) === 'member')
        return plr.error('You do not have permission to execute this command. You need to either be the owner or a admin of this faction.');
    if (spawn?.length && Array.from(plr.dimension.getEntities({ type: 'minecraft:player', location: { x: spawn[0], y: spawn[1], z: spawn[2] }, maxDistance: config.radius })).some(p => p.id === plr.id))
        return plr.error(`You have to be further than §c${config.radius}§e blocks from spawn.`);
    if (spawn?.length && !Array.from(plr.dimension.getEntities({ type: 'minecraft:player', location: { x: spawn[0], y: spawn[1], z: spawn[2] }, maxDistance: config.maxRadius })).some(p => p.id === plr.id))
        return plr.error(`You have to be within §c${config.maxRadius}§e blocks from spawn.`);
    const loc = [parseInt(`${plr.location.x}`), parseInt(`${plr.location.y}`), parseInt(`${plr.location.z}`), plr.dimension.id];
    db.write('s', loc);
    plr.send(`The faction spawn point has been set to §a${loc.join('§e, §a')}§e.`);
});
cmd.dynamicType('set:description', ['description', 'des', 'd'], async (plr, _, args) => {
    const db = await Database.register(fac.player.read(plr.rID, true), 'FTN');
    if (await getRole(plr, db) === 'member')
        return plr.error('You do not have permission to execute this command. You need to either be the owner or a admin of this faction.');
    db.write('d', args[0]);
    plr.send(`The faction description has been set to "§a${args[0]}§r§e".`);
}, 'any');
//Static type
cmd.dynamicType('set:permissions', ['permissions', 'perm', 'p-'], async (plr, _, args) => {
    const db = await Database.register(fac.player.read(plr.rID, true), 'FTN');
    if (await getRole(plr, db) === 'member')
        return plr.error('You do not have permission to execute this command. You need to either be the owner or a admin of this faction.');
    db.write('d', args[0]);
    plr.send(`The faction description has been set to "§a${args[0]}§r§e".`);
}, 'any');
cmd.dynamicType('home', ['home', 'spawn', 'h'], async (plr) => {
    if (!has({ player: plr }))
        return plr.error('You aren\'t even in a faction!');
    const spawn = (await Database.register(fac.player.read(plr.rID, true), 'FTN')).read('s');
    if (!spawn.length)
        return plr.error('You faction spawn hasen\'t been set yet...');
    plr.send('You have been teleported to your faction\'s spawnpoint');
    plr.addTag(quick.epics['Automod'].protections.teleport.skip);
    plr.teleport({ x: spawn[0], y: spawn[1], z: spawn[2] }, { dimension: world.getDimension(spawn[3]), rotation: { x: plr.getRotation().x, y: plr.getRotation().y } });
});
//set:name
cmd.dynamicType('info', ['info', 'information'], async (plr) => {
    let owner = config.veiwFaction ? getOwner(getChunk(plr)) : undefined;
    if (!owner)
        owner = fac.player.read(plr.rID, true);
    if (!owner || !Database.has(owner, 'FTN'))
        return plr.error('The chunk that you are in currently isn\'t protected by a faction, and you aren\'t in one. No information.');
    const faction = await get({ id: owner }), IDs = world.getAllPlayers().map(p => connected[p.name].rID), time = Date.now(), info = {
        Name: `§a${faction.name}`,
        Description: `§g${faction.description ? faction.description : 'Basic faction description.'}`,
        Open: `§g${faction.open}`,
        Bank: `§g${faction.bank}`,
        'Average power': `§g${faction.power}`,
        Home: `§g${faction.spawn.length ? faction.spawn.join('§e, §a') : '§cNot set...'}`,
        Claims: `§g[${faction.claims.map(c => `${c[0]}§c, §g${c[1]}`).join('§g] [')}§g]`,
        Allies: `§a${faction.allies.length ? faction.allies.join('§e, §a') : '§cNone'}`,
        Created: `§g${MS(time - faction.created)} ago`,
        Members: `${faction.members.map(m => `${IDs.includes(m.id) ? '§a[online]' : '§c[offline]'} §g${m.name}§e, role: §g${m.role}§e,${owner === fac.player.read(plr.rID, true) ? ` power: §g${m.power}§e,` : ''} join date: §g${MS(time - m.joinDate)} ago`).join('\n')}\n§e(§g${faction.members.length}§e/§6${config.maxPlayers}§e)`
    };
    if (owner !== fac.player.read(plr.rID, true)) {
        delete info.Claims;
        delete info.Allies;
        delete info.Home;
    }
    plr.send(`Here are the faction details:\n${Object.entries(info).map(e => `${e[0]}: §g${e[1]}`).join('\n§e')}`);
});
cmd.dynamicType('members', ['members', 'member', 'mem', 'm'], async (plr) => {
    let owner = config.veiwFaction ? getOwner(getChunk(plr)) : undefined;
    if (!owner)
        owner = fac.player.read(plr.rID, true);
    if (!owner || !Database.has(owner, 'FTN'))
        return plr.error('The chunk that you are in currently isn\'t protected by a faction, and you aren\'t in one. No information.');
    const db = await Database.register(owner, 'FTN'), IDs = world.getAllPlayers().map(p => connected[p.name].rID), time = Date.now();
    plr.send(`Here are the members in the "§g${db.read('n')}§e" faction (§g${db.read('m')}§e/§6${config.maxPlayers}§e):\n${Array.from(db.allKeys().filter(k => k.startsWith('u')).map(m => db.read(m)), (m) => `${IDs.includes(m[0]) ? '§a[online]' : '§c[offline]'} §g${m[1]}§e, role: §g${m[2] === 2 ? 'owner' : m[2] ? 'admin' : 'member'}§e,${owner === fac.player.read(plr.rID, true) ? ` power: §g${m[3]}§e,` : ''} join date: §g${MS(time - m[4])} ago`).join('\n')}`);
});
cmd.dynamicType('invite', 'invite', async (plr, _, args) => {
    if (!has({ player: plr }))
        return plr.error('You aren\'t even in a faction!');
    if (fac.invites.find(i => fac.player.read(plr.rID, true) === i[0] && i[2] === args[0].name))
        return plr.error('You already sent a invite to this player.');
    const db = await Database.register(fac.player.read(plr.rID, true), 'FTN');
    if (await getRole(plr, db) === 'member')
        return plr.error('You do not have permission to execute this command. You need to either be the owner or a admin of this faction.');
    if (db.read('m') >= config.maxPlayers)
        return plr.error('The faction you are in has reached the maximum amount of players.');
    if (fac.player.read(args[0].rID))
        return plr.error('This player is already in a faction.');
    //                  ^^ error here.
    plr.send(`A invite has been sent to §c${args[0].name}§e.`);
    args[0].send(`§c${plr.name}§e sent you a invite to join their faction. Type "§g${quick.prefix}f join ${db.read('n')}§e" in chat to join.`, 'FTN');
    fac.invites.push([fac.player.read(plr.rID, true), plr.name, args[0].name]);
}, 'player', true);
cmd.staticType('join', 'join', async (plr, name) => {
    if (fac.player.has(plr.rID))
        return plr.error('You are already in a faction.');
    if (!fac.names.has(name))
        return plr.error(`There isn't faction with the name §g${name}§e.`);
    const id = fac.names.read(name, true), db = await Database.register(id, 'FTN');
    if (!db.read('o') && !fac.invites.some(i => i[0] === id && i[2] === plr.name))
        return plr.error(`You must have an invitation to join §6${name}§e.`);
    let trying = true, u = 1;
    while (trying)
        if (!db.has(`u${u}`))
            trying = false;
        else
            u < 300 ? u++ : trying = false;
    if (u > 299 || db.has(`u${u}`))
        return plr.error('Unable to find you a player slot. Please report this error.');
    world.getAllPlayers().forEach(p => String(fac.player.read(connected[p.name].rID)) === id && Player.send(p, `Hey! §c${plr.name}§e just joined your faction.`));
    db.write(`u${u}`, [plr.rID, plr.name, 0, plr.getScore(config.powerObj), new Date().getTime()]);
    fac.invites.splice(fac.invites.findIndex(i => i[0] === id && i[2] === plr.name), 1);
    fac.player.write(plr.rID, Number(id));
    fac.playerI.write(plr.rID, u);
    db.write('m', db.read('m') + 1);
    plr.send(`You are now apart of §g${name}§e!`);
});
cmd.dynamicType('leave', ['leave', 'l'], async (plr) => {
    if (!has({ player: plr }))
        return plr.error('You aren\'t even in a faction!');
    const db = await Database.register(fac.player.read(plr.rID, true), 'FTN');
    if (await getRole(plr, db) === 'owner')
        return plr.error(`You cannot leave the faction you created. You have to delete it using "§c${quick.prefix}f delete§e"`);
    db.delete(`u${fac.playerI.read(plr.rID)}`);
    fac.chunks.findMany(Number(plr.rID)).forEach(c => fac.chunks.delete(c));
    fac.player.delete(plr.rID);
    fac.playerI.delete(plr.rID);
    fac.playerC.delete(plr.rID);
    db.write('m', db.read('m') - 1);
    plr.send(`You are no longer apart of the §g${db.read('n')}§e faction.`);
});
cmd.dynamicType('kick', ['kick'], async (plr, _, args) => {
    if (!has({ player: plr }))
        return plr.error('You aren\'t even in a faction!');
    if (fac.invites.find(i => fac.player.read(plr.rID, true) === i[0] && i[2] === args[0].name))
        return plr.error('You already sent a invite to this player.');
    if (plr.name === args[0].name)
        return plr.error('You cannot kick yourself.');
    const db = await Database.register(fac.player.read(plr.rID, true), 'FTN'), role = await getRole(plr, db);
    if (role === 'member')
        return plr.error('You do not have permission to execute this command. You need to either be the owner or a admin of this faction.');
    if (await getRole(args[0], db) !== 'member' && role !== 'owner')
        return plr.error('You can only kick members out of the faction if you are the owner.');
    db.delete(`u${fac.playerI.read(args[0].rID)}`);
    fac.chunks.findMany(Number(args[0].rID)).forEach(c => fac.chunks.delete(c));
    fac.player.delete(args[0].rID);
    fac.playerI.delete(args[0].rID);
    fac.playerC.delete(args[0].rID);
    db.write('m', db.read('m') - 1);
    plr.send(`§c${args[0].name}§e has been kicked out of the faction.`);
    args[0].send(`You have been kicked out of §g${db.read('n')}§e by §g${plr.name}§e!`);
}, 'player', true, 1);
cmd.bridge('top', 'top', ['top:value', 'top:power', 'top:kills'], (p, _, n) => !n.length && value(p, 'value'), false);
cmd.dynamicType('top:value', ['value', 'money', 'mon', 'v', '$'], plr => value(plr, 'value'));
cmd.dynamicType('top:power', ['power', 'pw', 'pr'], plr => value(plr, 'power'));
cmd.dynamicType('top:kills', ['kills', 'kill', 'ki'], plr => value(plr, 'kills'));
function value(player, top) {
    player.send(`Here are the top factions in ${top}:\n${Object.entries(fac[top].getCollection()).sort((a, b) => b[1] - a[1]).slice(0, 10).map((f, i) => `§a#${i + 1} §g${f[0]} §e- §g${f[1]}`).join('\n')}`);
}
cmd.dynamicType('nearby', ['nearby', 'map', 'locate', 'n'], (plr, _, args) => {
    if (plr.hasTag(config.autoTag)) {
        plr.removeTag(config.autoTag);
        return plr.send('Auto map has been turned off');
    }
    else
        plr.send(`Claims near you:\n§a${AsciiMap(plr)}`);
    if (!args[0])
        return;
    plr.addTag(config.autoTag);
    plr.send('Turning on auto map...');
}, 'any', false, 1, false);
cmd.dynamicType('deposit', ['deposit', 'dep'], (plr, _, args) => {
    if (!has({ player: plr }))
        return plr.error('You aren\'t even in a faction!');
    const current = plr.getScore(config.obj);
    if (args[0] <= 0)
        return plr.error('haha, your funny.');
    if (args[0] > current)
        return plr.error(`You cannot deposit §g${args[0]}§e because you only have §c${current}§e.`);
    const name = fac.names.find(fac.player.read(plr.rID));
    plr.runCommandAsync(`scoreboard players remove @s "${config.obj}" ${args[0]}`);
    fac.value.write(name, fac.value.read(name) + args[0]);
    plr.send(`Successfully transfered §a${args[0]}§e to your faction's bank.`);
}, 'number');
cmd.dynamicType('withdraw', ['withdraw', 'wd'], (plr, _, args) => {
    if (!has({ player: plr }))
        return plr.error('You aren\'t even in a faction!');
    const name = fac.names.find(fac.player.read(plr.rID));
    const current = fac.value.read(name);
    if (args[0] <= 0)
        return plr.error('Can\'t take anything lower than 1.');
    if (args[0] > current)
        return plr.error(`You cannot withdraw §g${args[0]}§e because the faction's bank only has §c${current}§e.`);
    plr.runCommandAsync(`scoreboard players add @s "${config.obj}" ${args[0]}`);
    fac.value.write(name, fac.value.read(name) - args[0]);
    plr.send(`Successfully transfered §a${args[0]}§e into your account.`);
}, 'number');
/**
 * Argument for multiple args, subCommands or subGroups
 */
cmd.unknownType('any');
cmd.booleanType('anybool');
cmd.numberType('number', undefined, undefined, { float: false });
cmd.playerType('player', undefined, true, undefined, { self: false }, false);
// /**
//  * @remarks StartinArg
//  * Permissions starting arg
//  * Subgroups: set: Subgroups: role: args: player | breakBlocks: none; | placeBlocks: none; | other: none;
//  */
// cmd.dynamicType('permissions', ['permissions', 'perms'], undefined, 'permissions:set', true);
// /**
//  * permissions set subGroup
//  */
// cmd.staticType('permissions:set', 'set', undefined, 'permissions:set:role', false)
// /**
//  * permissions set role subGroup
//  */
// cmd.dynamicType('permissions:set:role', 'role', undefined, 'permissions:set:role:player')
// /**
//  * Player argument for permissions set role
//  */
// cmd.playerType('permissions:set:role:player', (sender, player, args) => Faction.setRole(player, args[0], sender), true, 'role', undefined, false)
// /**
//  * Role argument for permissions set role player
//  */
// cmd.dynamicType('role', ['co-owner', 'admin', 'member'], undefined)
// /**
//  * @remarks StartinArg
//  * Leave starting arg
//  */
// cmd.dynamicType('ally', 'ally', (plr, _, args) => {
//     if (!Faction.playerInFaction(plr))
//         return plr.error('You are not member of any faction', 'FACTIONS')
//     const name = Faction.getFaction(plr)
//     if (!Faction.exist(name))
//         return false
//     if (!Faction.exist(args[0]))
//         return plr.send(`There is no faction with the name §6${args[0]}`)
//     const faction = Faction.find(name)
//     plr.send(`You are now ally with §6${args[0]}`)
//     faction.write('allies', [ Faction.getAllies(name), args[0] ].flat())
// }, 'any', true, 1, true)
// /**
//  * @remarks StartinArg
//  * Kick starting arg
//  * args: player: Player (player to kick);
//  */
// /**
//  * @remarks StartinArg
//  * Accept starting arg
//  */
// cmd.staticType('accept', 'accept', (player, _, args) => {
//     const sender: PlayerType = args[0]
//     Faction.acceptInvite(player, sender)
// }, 'player', false, true)
// /**
//  * @remarks StartinArg
//  * Accept starting arg
//  */
// cmd.staticType('decline', 'decline', (player, _, args) => {
//     const sender: PlayerType = args[0]
//     Faction.cancelInvite(player, sender)
// }, 'player', false, true)
// /**
//  * @remarks StartinArg
//  * Open starting arg
//  */
// cmd.dynamicType('open', 'open', plr => {
//     if (!Faction.playerInFaction(plr))
//         return plr.error(`You are not member of any faction`, 'FACTIONS')
//     const name = Faction.getFaction(plr)
//     if (!Faction.exist(name))
//         return false
//     const validRoles = ['owner', 'co-owner', 'admin']
//     if (!validRoles.includes(Faction.getMemberRole(plr)))
//         return plr.error('You do not have permission to open your faction', 'FACTIONS')
//     plr.send('You have changed the mode to enter your faction to: §6public§r', 'FACTIONS')
//     return Faction.find(name).write('open', true)
// })
// /**
//  * @remarks StartinArg
//  * Close starting arg
//  */
// cmd.dynamicType('close', 'close', plr => {
//     if (!Faction.playerInFaction(plr))
//         return plr.error(`You are not member of any faction`, 'FACTIONS')
//     const name = Faction.getFaction(plr)
//     if (!Faction.exist(name))
//         return false
//     const validRoles = ['owner', 'co-owner', 'admin']
//     if (!validRoles.includes(Faction.getMemberRole(plr)))
//         return plr.error('You do not have permission to close your faction', 'FACTIONS')
//     plr.send('You have changed the mode to enter your faction to: §6invitation only')
//     return Faction.find(name).write('open', false)
// })
