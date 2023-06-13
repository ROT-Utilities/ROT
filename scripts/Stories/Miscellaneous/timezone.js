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
try {
    world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "ROTTimezone" dummy`);
}
catch { }
;
const cmd = Commands.create({
    name: 'timezone',
    description: 'This just sets the timezone in the chat to your time :)',
    aliases: ['tz'],
    category: 'Miscellaneous',
    developers: ['Aex66']
});
cmd.startingArgs('timezone', true);
cmd.numberType('timezone', (plr, val) => {
    if (val >= 24 || val <= -24)
        return plr.error('That is not a vaid number.');
    plr.runCommandAsync(`scoreboard players set @s ROTTimezone ${val}`);
    plr.send(`Your timezone has been set to §6§l${val >= 0 ? '+' + val : val}§r§e hours!`);
}, [], { float: false });
