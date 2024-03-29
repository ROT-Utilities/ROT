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
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
const cmd = Commands.create({
    name: 'text',
    description: 'Makes a cool little floating text so you don\'t have to place signs everywhere!',
    aliases: ['t', 'floating-text', 'holo', 'hologram'],
    category: 'Structure',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['spawn', 'kill']);
cmd.unknownType('any', null);
cmd.numberType('anynumber', null, null, { float: true, min: 1 });
cmd.dynamicType('spawn', 'spawn', (plr, _, args) => {
    const text = args[0].join(' ');
    if (text.includes('"'))
        return plr.error('The hologram may not include a §4"§r');
    plr.send(`Creating a hologram...\nCreated hologram "§c${text}§r§7"!`);
    console.warn(text);
    const lines = text.split('\\n');
    lines.forEach((l, i) => plr.runCommandAsync(`summon rot:hologram "${l}" ~~${0.25 * (lines.length - i)}~`));
}, 'any');
cmd.dynamicType('kill', 'kill', (plr, _, args) => {
    let radius = args[0] ?? 1;
    plr.send(`Killing all holograms in the radius of §c${radius}§e blocks from your current loction!`, 'TEXT');
    plr.runCommandAsync(`kill @e[type=rot:hologram,r=${radius},tag=!ROTLB]`);
}, 'anynumber', true, undefined, false);
