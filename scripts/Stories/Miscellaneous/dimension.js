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
import quick from '../../quick.js';
const cmd = Commands.create({
    name: 'dimension',
    description: 'Teleport to a dimension',
    aliases: ['dim', 'mins', 'place'],
    category: 'Miscellaneous',
    admin: true,
    developers: ['Aex66', 'Mo9ses']
});
cmd.startingArgs('dimension');
cmd.dynamicType('dimension', ['overworld', 'nether', 'end'], (sender, dim, args) => {
    const loc = args[1], rot = args[0].getRotation();
    args[0].addTag(quick.epics['Automod'].protections.teleport.skip);
    args[0].teleport(loc, { dimension: world.getDimension(dim === 'end' ? 'the end' : dim), rotation: { x: rot.x, y: rot.y } });
    args[0].send(`You have been teleported to the dimension §6${dim}§e at §6${~~loc.x}§e, §6${~~loc.y}§e, §6${~~loc.z}§e!`);
    if (sender.name !== args[0].name)
        sender.send(`§c${args[0].name}§e has been teleported to the dimension §6${dim}§e at §6${~~loc.x}§e, §6${~~loc.y}§e, §6${~~loc.z}§e`);
}, 'player');
cmd.playerType('player', null, true, 'location');
cmd.locationType('location', null);
