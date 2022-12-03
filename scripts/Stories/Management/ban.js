/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer),
notbeer (ROT's base code)
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
const timeFormatRegex = /^\d+\.?\d*\s?((years*?|yrs*?)|(weeks*?)|(days*?)|(hours*?|hrs*?)|(minutes*?|mins*?)|(seconds*?|secs*?)|(milliseconds*?|msecs*?|ms)|[smhdwy])(?!\S)(?=\s?)/;
import { DatabasePaper } from "../../Papers/DatabasePaper.js";
import { MS } from "../../Papers/paragraphs/ConvertersParagraphs.js";
import { twoStepKick } from "../../Papers/paragraphs/ExtrasParagraphs.js";
import Server from "../../ServerBook.js";
const cmd = Server.command.create({
    name: 'ban',
    description: 'A simple ban command...',
    aliases: ['tempban', 'bam'],
    category: 'Management',
    developers: ['Aex66']
});
cmd.startingArgs('player');
const bans = new DatabasePaper('bans');
cmd.playerType('player', (plr, plr2, args) => {
    if (plr.id === plr2.id)
        return plr.error('You cannot ban yourself bozo');
    if (plr2.isAdmin)
        return plr.error('You may not ban a staff member!');
    if (bans.has(plr2.id))
        return plr.error(`Player "§4${plr2.name}§c" is already banned...`);
    const time = MS(args[0]), reason = args[1].replace(/^\s/, ''), today = new Date();
    const banData = {
        playerName: plr2.name,
        date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
        time,
        unbanTime: time + Date.now(),
        reason,
        bannedBy: plr.name,
        playerId: plr2.id
    };
    bans.write(plr2.id, banData, true);
    Server.broadcast(`Successfully banned §c${plr2.name}§7 for §c${args[0]}§7${reason ? ` for "§c${reason}§r§7"` : ''}!`, '@a', 'BAN');
    twoStepKick(plr2, banData);
}, true, 'time', null, true);
cmd.timeType('time', null, null, { min: 900000, max: 3154000000000 });
cmd.dynamicType('reason', '*', null);
//Finish
