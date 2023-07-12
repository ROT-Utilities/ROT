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
import { sleep } from '../../Papers/Paragraphs/ExtrasParagraphs.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Server from '../../Papers/ServerPaper.js';
import Player from '../../Papers/PlayerPaper.js';
import quick from '../../quick.js';
const cmd = Commands.create({
    name: 'kt',
    description: 'This command will kick any players from the game with a certain tag',
    aliases: ['ktag', 'ktags', 'kicktag', 'kicktags'],
    category: 'Management',
    admin: true,
    developers: ['Aex66', 'Mo9ses']
});
cmd.startingArgs(['set', 'toggle', 'msg']);
cmd.unknownType('any', null, 1, false);
cmd.staticType('set', 'set', (plr, tag) => {
    if (tag === quick.adminTag)
        return plr.error('You cannot put this tag');
    plr.send(`The kick tag is now "§c${tag}§r§e".`);
    Server.db.write('KT', tag);
});
cmd.staticType('toggle', 'toggle', (plr) => {
    Server.db.write('KTT', !Boolean(Server.db.read('KTT')));
    plr.send(`Kick tags is now §${Server.db.read('KTT') ? 'con' : 'aoff'}§e.`);
}, null, false);
cmd.dynamicType('msg', ['message', 'msg', 'text', 'mess', 'reason', 'reasons'], (plr, _, args) => {
    const reason = args[0];
    Server.db.write('KTM', reason);
    plr.send(`The new kick message is now "§c${reason}§r§e".`);
}, 'any');
system.runInterval(async () => {
    if (!Server.db.read('KTT') || system.currentTick < 50)
        return;
    const tag = Server.db.read('KT'), reason = Server.db.read('KTM');
    if (!tag)
        return;
    for (const player of world.getPlayers()) {
        if (!player.hasTag(tag) || !Player.isConnected(player) || Player.isAdmin(player))
            continue;
        player.dimension.runCommandAsync(`kick "${player.name}" ${reason ?? 'No reason!'}`);
        await sleep(10);
    }
}, 25);
