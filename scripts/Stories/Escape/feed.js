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
import quick from '../../Papers/DatabasePaper.js';
import Server from '../../ServerBook.js';
const cmd = Server.command.create({
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
    sender.send(`${plr.nameTag} has been feeded?`);
    plr.addEffect(MinecraftEffectTypes.saturation, 40, 255, false);
    plr.send('You have been feed!');
});
