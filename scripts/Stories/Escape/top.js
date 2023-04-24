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
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Server from '../../Papers/ServerPaper.js';
import quick from '../../quick.js';
const cmd = Commands.create({
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
