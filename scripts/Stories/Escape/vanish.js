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
    name: 'vanish',
    description: `When you type ${quick.prefix}vanish in chat... You'll vanish!`,
    aliases: ['v', 'van', 'disappear'],
    category: 'Escape',
    admin: true,
    developers: ['Aex66']
});
cmd.startingArgs('name', false);
cmd.callback(async (plr, args) => {
    if (args.length)
        return;
    if (!plr.hasTag('vanish')) {
        plr.addEffect(MinecraftEffectTypes.invisibility, 2006000, 255, false);
        plr.addEffect(MinecraftEffectTypes.nightVision, 2006000, 255, false);
        plr.removeTag('unvanish');
        plr.addTag('vanish');
        plr.triggerEvent('rot:vanish');
        return plr.send('You Have Vanished...', 'VANISH');
    }
    else {
        plr.triggerEvent('rot:unvanish');
        plr.addTag('dvvanish');
        await plr.runCommandAsync('effect @s clear');
        plr.removeTag('vanish');
        plr.addTag('unvanish');
        plr.removeTag('dvvanish');
    }
});
cmd.playerType('name', async (_, plr) => {
    if (!plr.hasTag('vanish')) {
        plr.addEffect(MinecraftEffectTypes.invisibility, 2006000, 255, false);
        plr.addEffect(MinecraftEffectTypes.nightVision, 2006000, 255, false);
        plr.removeTag('unvanish');
        plr.addTag('vanish');
        plr.triggerEvent('rot:vanish');
        return plr.send('You Have Vanished...', 'VANISH');
    }
    else {
        plr.triggerEvent('rot:unvanish');
        plr.addTag('dvvanish');
        try {
            await plr.runCommandAsync('effect @s clear');
        }
        catch { }
        plr.removeTag('vanish');
        plr.addTag('unvanish');
        plr.removeTag('dvvanish');
    }
});
