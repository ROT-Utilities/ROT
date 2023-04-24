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
import { MinecraftEffectTypes } from '@minecraft/server';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import quick from '../../quick.js';
const cmd = Commands.create({
    name: 'kill',
    description: `When you type ${quick.prefix}kill in chat... I'll kill you!`,
    aliases: ['death', 'die'],
    category: 'Escape',
    developers: ['Aex66']
});
cmd.startingArgs('name', false);
cmd.callback((plr, args) => {
    if (args.length)
        return;
    plr.send('You have been killed!', 'KILL');
    plr.addEffect(MinecraftEffectTypes.instantDamage, 40, 255, false);
});
cmd.playerType("name", (sender, plr) => {
    plr.send('You have been killed!', 'KILL');
    plr.addEffect(MinecraftEffectTypes.instantDamage, 40, 255, false);
});
