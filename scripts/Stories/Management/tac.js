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
import config from '../../main.js';
import Server from '../../ServerBook.js';
const cmd = Server.command.create({
    name: 'tac',
    description: 'Clears all of the tags off of a player. (expect the admin tag if they have it)',
    aliases: ['tc', 'tagc', 'tclear', 'tac'],
    category: 'Management',
    admin: true,
    developers: ['Aex66']
});
cmd.startingArgs('name', false);
cmd.callback((plr, args) => !args.length && plr.getTags().forEach(tag => tag !== config.adminTag ? plr.removeTag(tag) : false));
cmd.playerType('name', (_, plr) => plr.getTags().forEach(tag => tag !== config.adminTag ? plr.removeTag(tag) : false));
