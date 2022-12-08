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
© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import Server from '../../ServerBook.js';
import { DatabasePaper } from '../../Papers/DatabasePaper.js';
const db = new DatabasePaper('ranks');
const cmd = Server.command.create({
    name: 'rank',
    description: 'Adds and creates roles for the server',
    aliases: ['ranks', 'display', 'role'],
    category: 'Management',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['create', 'delete', 'plr', 'remove', 'prefix']);
cmd.staticType('create', 'create', (plr, val, args) => {
    if (db.has(val))
        return plr.error(`A rank with the name "§3${val}§1" has already been created!`);
    db.write(val, { tag: val, prefix: args[0].length ? args[0].join(' ') : '§eNew Rank' });
    plr.send(`Successfully created rank §3${val}§1 with the prefix "§r${args[0].length ? args[0].join(' ') : '§eNew Rank'}§r§1"!`);
}, 'set prefix', true, false);
cmd.dynamicType('set prefix', '*');
cmd.staticType('delete', 'delyeet', (plr, val) => {
    if (!db.has(val))
        return plr.error(`There aren't any ranks with the name "§3${val}§1". Are you sure it isn't a tag?`);
    plr.send(`Successfully removed rank §3${val}§1 with the prefix "§r${db.read(val).prefix}§r§1"!`);
    db.delete(val);
}, null, true);
cmd.staticType('list', 'list', plr => {
    const allKeys = db.allKeys();
    if (!allKeys.length)
        return plr.send('There are no ranks on the server at this moment');
    plr.send(`Here are all of the ranks!\n${db.allKeys().map(r => `§3Name: §1${r[0].toUpperCase() + r.slice(1)}§3, tag: §1${db.read(r).tag}§3, prefix: §1${db.read(r).prefix}§r`).join('\n')}`);
}, null, false);
cmd.playerType('set player', (plr, plr2, args) => {
}, true, ['add', 'remove']);
cmd.staticType('add', 'add', (plr, _, args) => {
}, 'set player', false);
cmd.staticType('remove', 'remove', (plr, _, args) => {
}, 'set player', false);
