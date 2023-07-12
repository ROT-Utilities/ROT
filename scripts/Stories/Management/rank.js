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
import { system, world } from '@minecraft/server';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import Player from '../../Papers/PlayerPaper.js';
import quick from '../../quick.js';
let db = null;
(async function () {
    db = await Database.register('ranks');
})();
const cmd = Commands.create({
    name: 'rank',
    description: 'Adds and creates roles for the server',
    aliases: ['ranks', 'display', 'role'],
    category: 'Management',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['create', 'delete', 'list', 'plr', 'set']);
cmd.staticType('create', 'create', (plr, val, args) => {
    if (db.has(val))
        return plr.error(`A rank with the name "§6${val}§e" has already been created!`);
    db.write(val, { tag: val, prefix: args[0]?.length ? args[0].join(' ') : '§eNew Rank' });
    plr.send(`Successfully created rank §6${val}§e with the prefix "§r${args[0]?.length ? args[0].join(' ') : '§aNew Rank'}§r§e"!`);
}, 'any', true, false);
cmd.staticType('delete', 'delyeet', (plr, val) => {
    if (!db.has(val))
        return plr.error(`There aren't any ranks with the name "§6${val}§e". Are you sure it isn't a tag?`);
    plr.send(`Successfully removed rank §6${val}§e with the prefix "§r${db.read(val).prefix}§r§e"!`);
    db.delete(val);
}, null, true);
cmd.staticType('list', 'list', plr => {
    const allKeys = db.allKeys();
    if (!allKeys.length)
        return plr.send('There are no ranks on the server at this moment');
    plr.send(`Here are all of the ranks!\n${db.allKeys().map(r => `§6Name: §e${r[0].toUpperCase() + r.slice(1)}§6, tag: §e${db.read(r).tag}§6, prefix: §e${db.read(r).prefix}§r`).join('\n')}`);
}, null, false);
cmd.playerType('plr', (plr, plr2, args) => {
    if (args[0] === 'add')
        plr2.addTag(args[1].join(' '));
    else
        plr.removeTag(args[1].join(' '));
    plr.send(`The rank "§6${args[1].join(' ')}§e" have been ${args[0] === 'add' ? '§agranted§e to' : '§crevoked§e from'} §6${plr2.name}§e!`);
}, true, ['add', 'remove']);
cmd.staticType('add', 'add', null, 'any', false);
cmd.staticType('remove', 'remove', null, 'any', false);
cmd.staticType('set', 'set', (plr, val, args) => {
}, ['prefix', 'name', 'color'], true);
cmd.dynamicType('prefix', ['prefix', 'pre', 'before'], null, 'any');
cmd.staticType('name', 'rename', null, 'any', false);
cmd.dynamicType('color', ['color', 'namecolor'], null, 'any');
cmd.unknownType('any', null, 255, true);
system.runInterval(() => world.getAllPlayers().forEach(player => {
    if (!Player.isConnected(player))
        return;
    const health = player.getComponent('health').currentValue;
    player.nameTag = `§7[${Player.getPrefixes(player).join('§r§7, ')}§r§7] ${Player.getNameColor(player)}${quick.displayHealth ? `\n§r§4❤ §c${~~(health)}` : ''}`;
}), 20);
