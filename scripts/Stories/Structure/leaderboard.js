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
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { world } from '@minecraft/server';
import { setTickInterval } from '../../Papers/paragraphs/ExtrasParagraphs.js';
import { metricNumbers } from '../../Papers/paragraphs/ConvertersParagraphs.js';
import { connected } from '../../Tales/playerConnect.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Server from '../../Papers/ServerPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import Player from '../../Papers/PlayerPaper.js';
const cmd = Commands.create({
    name: 'leaderboard',
    description: 'This is the command everyone has been waiting for (not really), LEADERBOARDS',
    aliases: ['lb', 'leadb', 'lead', 'lboard', 'leader'],
    category: 'Building',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['create', 'delete', 'set']);
cmd.staticType('create', 'create', (player, value, args) => {
    Server.runCommand(`scoreboard objectives add "${value}" dummy`);
    const rabbit = world.events.entitySpawn.subscribe(({ entity }) => {
        entity.addTag('ROTLB');
        entity.addTag(`o:${value}`);
        entity.addTag(`l:${args[0] ? args[0] : 10}`);
        entity.addTag(`h:§4§l${value.toUpperCase()}§r§c LEADERBOARD§r`);
        const db = Database.register(value, 'ROTLB');
        db.write('l', (db.has('l') ? db.read('l') : 0) + 1);
        world.events.entitySpawn.unsubscribe(rabbit);
    });
    player.dimension.spawnEntity('minecraft:rabbit', player.toLocation());
    player.send(`Successfully created a leaderboard displaying the objective "§6${value}§r§e".§r`);
}, 'length', true, false);
cmd.numberType('length', null, null, { min: 4, max: 16 });
cmd.staticType('delete', 'delyeet', (plr) => {
    let entity = Array.from(plr.dimension.getEntities({ type: "minecraft:rabbit", tags: ['ROTLB'], maxDistance: 2, location: plr.toLocation() }))[0];
    if (!entity)
        return plr.error('Unable to locate a leaderboard within the radius of §a2§e blocks. Maybe move a bit closer?§r');
    const obj = entity.getTags().find(tag => tag.startsWith('o:')).replace('o:', ''), db = Database.register(obj, 'ROTLB');
    plr.send(`Successfully removed a nearby leaderboard displaying the objective "§c${obj}§r§e".`);
    db.write('l', db.read('l') - 1);
    if (!db.read('l'))
        Database.drop(obj, 'ROTLB');
    entity.kill();
}, null, false);
cmd.bridge('set', 'set', ['long', 'head']);
cmd.dynamicType('long', ['length', 'long', 'l'], (plr, val, args) => {
    let entity = Array.from(plr.dimension.getEntities({ type: "minecraft:rabbit", tags: ['ROTLB'], maxDistance: 2, location: plr.toLocation() }))[0];
    if (!entity)
        return plr.error('Unable to locate a leaderboard within the radius of §a2§e blocks. Maybe move a bit closer?§r');
    entity.removeTag(entity.getTags().find(tag => tag.startsWith('l:')));
    entity.addTag(`l:${args[0]}`);
    plr.send(`Successfully changed the length of the leaderboard "§c${entity.getTags().find(tag => tag.startsWith('o:')).replace('o:', '')}§r§e".`);
}, 'length');
cmd.dynamicType('head', ['head', 'header', 'h'], (plr, val, args) => {
    let entity = Array.from(plr.dimension.getEntities({ type: "minecraft:rabbit", tags: ['ROTLB'], maxDistance: 2, location: plr.toLocation() }))[0];
    if (!entity)
        return plr.error('Unable to locate a leaderboard within the radius of §a2§e blocks. Maybe move a bit closer?§r');
    entity.removeTag(entity.getTags().find(tag => tag.startsWith('h:')));
    entity.addTag(`h:${args[0].join(' ')}`);
    plr.send(`Successfully changed the heading of the leaderboard "§c${entity.getTags().find(tag => tag.startsWith('o:')).replace('o:', '')}§r§e".`);
}, 'name', false);
cmd.unknownType('name');
setTickInterval(() => {
    const leaderboards = {};
    Array.from(world.getDimension('overworld').getEntities({ type: 'minecraft:rabbit', tags: ['ROTLB'] })).forEach(entity => {
        const objective = entity.getTags().find(t => t.startsWith('o:')).replace('o:', '');
        if (!objective || !world.scoreboard.getObjective(objective))
            entity.nameTag = `§c§lObjective: "${objective || null}" has no records§r`;
        let leaderboard;
        if (leaderboards.hasOwnProperty(objective))
            leaderboard = leaderboards[objective];
        else {
            leaderboard = getLeaderboard(objective);
            Object.assign(leaderboards, { [objective]: leaderboard });
        }
        if (!leaderboard)
            return;
        leaderboard = leaderboard.slice(0, parseInt(entity.getTags().find(t => t.startsWith('l:')).replace('l:', '')));
        leaderboard.unshift(entity.getTags().find(t => t.startsWith('h:')).replace('h:', ''));
        entity.nameTag = leaderboard.join('\n');
    });
}, 25);
function getLeaderboard(objective) {
    const db = Database.register(objective, 'ROTLB'), top = db.getCollection(), players = world.getAllPlayers().filter(p => connected.hasOwnProperty(p.name));
    delete top['l'];
    let before = {}, after = {};
    Object.keys(top).forEach(i => { Object.assign(before, { [i]: top[i][2] }); Object.assign(after, { [i]: top[i][2] }); });
    for (const player of players)
        Object.assign(after, { [connected[player.name].rID]: Player.getScore(player, objective) });
    if (Object.keys(after).every(a => before.hasOwnProperty(a) && before[a] === after[a]))
        return;
    console.warn('Pointed');
    const writeMany = {}, leaderboard = [];
    db.deleteMany(Object.keys(before).filter(id => !after.hasOwnProperty(id)));
    Object.entries(after).sort((a, b) => b[1] - a[1]).slice(0, 32).forEach((p, i) => {
        const player = players.find(plr => connected[plr.name].rID === p[0]);
        if (player && before[p[0]] !== p[1])
            Object.assign(writeMany, { [p[0]]: [Player.getNameColor(player), Player.getPrefixes(player).join('§r§7, '), p[1]] });
        leaderboard.push(`§9${i + 1} §7[${player ? Player.getPrefixes(player).join('§r§7, ') : top[p[0]][1]}§r§7] ${player ? Player.getNameColor(player) : top[p[0]][0]} §r§7- §c${metricNumbers(p[1])}§r`);
    });
    db.writeMany(writeMany);
    return leaderboard;
}
