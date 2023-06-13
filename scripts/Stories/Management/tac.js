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
import quick from '../../quick.js';
const cmd = Commands.create({
    name: 'tac',
    description: 'Clears all of the tags off of a player. (expect the admin tag if they have it)',
    aliases: ['tc', 'tagc', 'tclear'],
    category: 'Management',
    admin: true,
    developers: ['Aex66']
});
cmd.startingArgs('name');
cmd.playerType('name', (plr, plr2) => plr.send(`Removed §6${plr2.getTags().filter(tag => tag !== quick.adminTag && plr2.removeTag(tag)).length}§e tag(s) from §a${plr2.name}`));
