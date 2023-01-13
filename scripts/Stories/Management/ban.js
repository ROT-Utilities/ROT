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
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import Server from '../../Papers/ServerPaper.js';
const db = Database.register('ban');
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
        return plr.send('You cannot ban a administrator');
    const date = new Date(), banData = {
        date: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
        unban: args[0] + date.getTime(),
        res: args[1],
        by: plr.nameTag,
        id: val.database?.table
    };
    if (val.database)
        val.write('ban', banData);
    else
        db.write(val.nameTag, banData);
    Server.broadcast(`§6${val.nameTag}§e was banned for §6${banData.date.join('§e, §6')}§e${banData.res ? ` for "§6${banData.res}§r§e"` : ''}!`);
}, false, 'time', null, false);
cmd.timeType('time', null, 'reason', null, false);
cmd.dynamicType('reason', '*');
