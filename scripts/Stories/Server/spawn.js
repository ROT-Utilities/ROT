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
import Server from '../../Papers/ServerPaper.js';
import quick from '../../quick.js';
const cmd = Commands.create({
    name: 'spawn',
    description: 'Tp to spawn!',
    aliases: ['hub', 'lobby'],
    category: 'Server',
    developers: ['Aex66']
});
cmd.startingArgs('set', false);
cmd.callback((plr, args) => {
    if (args.length)
        return;
    const spawn = Server.db.read('spawn');
    if (!spawn)
        return plr.error('An error occurred while teleporting to spawn...');
    const [x, y, z, dim] = spawn;
    plr.send('Teleporting to spawn...');
    plr.addTag(quick.epics['Automod'].protections.teleport.skip);
    plr.teleport({ x, y, z }, { dimension: world.getDimension(dim), rotation: { x: plr.getRotation().x, y: plr.getRotation().y } });
});
cmd.staticType('set', 'set', (plr) => {
    let { x, y, z } = plr.location;
    const dim = plr.dimension.id;
    x = ~~(x);
    y = ~~(y);
    z = ~~(z);
    if (x > 5000000 || y > 5000000 || z > 5000000)
        return plr.error('Yeah, no... No numbers greater than 5 million.');
    plr.send('You have set the location spawn location!');
    Server.db.write('spawn', [~~(x), ~~(y), ~~(z), dim]);
}, null, false);
cmd.config('set', { admin: true });
