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
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
const cmd = Commands.create({
    name: 'text',
    description: 'Makes a cool little floating text so you don\'t have to place signs everywhere!',
    aliases: ['t', 'floating-text'],
    category: 'Building',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['spawn', 'kill']);
cmd.unknownType('any', null);
cmd.numberType('anynumber', null, null, { float: true, min: 1 });
cmd.dynamicType('spawn', 'spawn', (plr, _, args) => {
    plr.send(`Creating floating text...\nCreated floating text "§c${args[0].join(' ')}§r§7"!`, 'TEXT');
    if (args[0].join(' ').includes('"'))
        plr.error('The text may not include a §4"§r');
    const rabbit = plr.dimension.spawnEntity('minecraft:rabbit', plr.toLocation());
    rabbit.nameTag = args[0].join(' ');
    rabbit.addTag('ROTTEXT');
}, 'any');
cmd.dynamicType('kill', 'kill', (plr, _, args) => {
    let radius = args[0] ?? 1;
    plr.send(`Killing all floating text in the radius of §c${radius}§7 blocks from your current loction!`, 'TEXT');
    plr.runCommandAsync(`kill @e[type=rabbit,r=${radius},tag=ROTTEXT]`);
}, 'anynumber', true, undefined, false);