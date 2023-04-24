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
    name: 'feed',
    description: `When you type ${quick.prefix}feed in chat... I'll feed you`,
    aliases: ['f', 'food', 'hunger', 'saturation'],
    category: 'Escape',
    developers: ['Aex66']
});
cmd.startingArgs('name', false);
cmd.callback((plr, args) => {
    if (args.length)
        return;
    plr.addEffect(MinecraftEffectTypes.saturation, 40, 255, false);
    plr.send('You have been feed!');
});
cmd.playerType('name', (sender, plr) => {
    sender.send(`${plr.name} has been feed.`);
    plr.addEffect(MinecraftEffectTypes.saturation, 40, 255, false);
    plr.send('You have been feed!');
});
