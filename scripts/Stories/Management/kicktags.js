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
import { setTickInterval, sleep } from '../../Papers/paragraphs/ExtrasParagraphs.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Database from '../../Papers/DatabasePaper.js';
const db = Database.register('server');
const cmd = Commands.create({
    name: 'kicktags',
    description: 'This command will kick any players from the game with a certain tag',
    aliases: ['ktag', 'ktags', 'kicktag'],
    category: 'Management',
    admin: true,
    developers: ['Aex66']
});
cmd.startingArgs(['set', 'toggle', 'msg']);
cmd.unknownType('any', null);
cmd.staticType('set', 'set', (plr, tag) => {
    if (['v'].includes(tag))
        return plr.send('§cYou cannot put this tag', 'KICK TAGS');
    plr.send(`The ROT's kick tag is now "§c${tag}§r§7"!`, 'KICK TAGS');
    db.write('KTTAG', tag);
});
cmd.staticType('toggle', 'toggle', (plr) => {
    if (db.read('KTT'))
        db.write('KTT', 0);
    else
        db.write('KTT', 1);
    return plr.send(`Kick tags is now §c${db.read('KTT') ? 'on' : 'off'}§7!`, 'KICK TAGS');
}, null, false);
cmd.dynamicType('msg', ['message', 'msg', 'text', 'mess', 'reason', 'reasons'], (plr, _, args) => {
    let reason = args[0].join(' ');
    db.write('KTMsg', reason);
    return plr.send(`The new kick message is now "§c${reason}§r§7"!`, 'KICK TAGS');
}, 'any');
setTickInterval(async () => {
    if (!db.read('KTT'))
        return;
    const tag = db.read('KTTAG');
    let reason = db.read('KTMsg');
    if (!tag)
        return;
    if (!reason)
        reason = 'No reason!';
    for (const player of world.getPlayers()) {
        if (!player.hasTag(tag))
            continue;
        world.getDimension('overworld').runCommandAsync(`kick ${player.name} ${reason}`);
        await sleep(1);
    }
}, 10);
