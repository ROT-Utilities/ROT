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
import { system } from '@minecraft/server';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import { connected } from '../../Tales/playerConnect.js';
import { world } from "@minecraft/server";
import { MS } from '../../Papers/Paragraphs/ConvertersParagraphs.js';
export const ban = {
    regReason: null,
    regExpire: null
};
(async function () {
    ban.regReason = await Database.registry('banReason');
    ban.regExpire = await Database.registry('banExpire');
})();
const cmd = Commands.create({
    name: 'ban',
    description: 'A simple ban command...',
    aliases: ['tempban', 'bam'],
    category: 'Management',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs('player');
cmd.playerType('player', (plr, val, args) => {
    if (val.player?.isAdmin)
        return plr.send('You cannot ban an administrator');
    if (args[1]?.includes('$-$'))
        return plr.error('You cannot use "$-$" in the reason.');
    if (val.name.includes('$-$'))
        return plr.error('That player seems to have an illegal name!');
    console.warn(val?.rID);
    plr.send(`You have just banned §a${val.name}`);
    const data = ban.regExpire.find(Number(val.rID));
    if (data)
        ban.regExpire.delete(data);
    ban.regReason.write(`${val?.name}$-$${args[1] || 'No reason specified'}$-$${val.rID}`, Number(val.rID));
    ban.regExpire.write(`${Date.now() + args[0]}$-$${val.rID}`, Number(val.rID));
}, false, 'time', { self: false }, true);
cmd.timeType('time', null, 'reason', null, false);
cmd.unknownType('reason', null, 1);
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (!ban.regExpire || ban.regReason)
            return;
        const rID = connected[player.name]?.rID, date = ban.regExpire.find(Number(rID)), reason = ban.regReason.find(Number(rID));
        if (!date)
            continue;
        const expire = Number(date?.split('$-$')?.[0]) ?? 0;
        if (Date.now() < expire)
            return player.runCommand(`kick "${player.name}" \n§7Reason: ${reason?.split('$-$')?.[1]}\nY§7our ban will expire in: §c${MS(expire - Date.now())}`);
        ban.regExpire.delete(date);
        ban.regReason.delete(reason);
        console.warn(`Player §c${player.name}§r with ID §c${rID}§r got unbanned!`);
    }
});
