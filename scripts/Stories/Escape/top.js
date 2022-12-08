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
import Server from '../../ServerBook.js';
import quick from '../../main.js';
const cmd = Server.command.create({
    name: 'top',
    description: `When you type ${quick.prefix}top in chat... I'll teleport you to the highest point above your player!`,
    aliases: ['highest', 'point'],
    category: 'Escape',
    developers: ['Aex66']
});
cmd.startingArgs('name', false);
cmd.callback((plr, args) => {
    if (args.length)
        return;
    plr.send('You have been teleported to the highest point above your player\'s last location!', 'TOP');
    Server.runCommands([`execute ${plr.name} ~~~ tp @s ~ 330 ~`, `execute ${plr.name} ~~~ effect @s resistance 15 255 true`]);
});
cmd.playerType('name', (_, plr) => {
    plr.send('You have been teleported to the highest point above your player\'s last location!', 'TOP');
    Server.runCommands([`execute ${plr.name} ~~~ tp @s ~ 330 ~`, `execute ${plr.name} ~~~ effect @s resistance 15 255 true`]);
});
