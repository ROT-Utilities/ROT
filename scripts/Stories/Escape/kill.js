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
import { MinecraftEffectTypes } from '@minecraft/server';
import Server from '../../ServerBook.js';
import quick from '../../main.js';
const cmd = Server.command.create({
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
cmd.playerType("name", (_, plr) => {
    plr.send('You have been killed!', 'KILL');
    plr.addEffect(MinecraftEffectTypes.instantDamage, 40, 255, false);
});
