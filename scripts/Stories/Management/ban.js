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
import Server from "../../ServerBook.js";
const cmd = Server.command.create({
    name: 'ban',
    description: 'A simple ban command...',
    aliases: ['tempban', 'bam'],
    category: 'Management',
    admin: true,
    developers: ['Aex66']
});
cmd.startingArgs('player');
cmd.playerType('player', (plr, plr2, args) => {
}, true, 'time', undefined, false);
cmd.timeType('time', null, null, { min: 900000, max: 3154000000000 });
cmd.dynamicType('reason', '*', null);
