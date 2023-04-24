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
import { world } from '@minecraft/server';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
const cmd = Commands.create({
    name: 'dimension',
    description: 'Teleport to a dimension',
    aliases: ['dim', 'mins', 'place'],
    category: 'Miscellaneous',
    admin: true,
    developers: ['Aex66']
});
cmd.startingArgs('player');
cmd.dynamicType('dimension', ['overworld', 'nether', 'the end'], null, 'location');
cmd.locationType('location', null);
cmd.playerType('player', (_, player, args) => {
    const loc = args[1], rot = player.getRotation();
    player.teleport(loc, world.getDimension(args[0]), rot.x, rot.y);
    player.send(`You have been teleported to the dimension §6${args[0]}§e at §6${~~loc.x}§e, §6${~~loc.y}§e, §6${~~loc.z}§e! `, 'DIMS');
}, true, 'dimension');
