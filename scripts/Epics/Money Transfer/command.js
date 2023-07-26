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
import { metricNumbers } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import quick from "../../quick.js";
const cmd = Commands.create({
    name: 'moneyt',
    description: 'Transfer an amount of money from you to someone.',
    category: 'Epics',
    aliases: ['mt', 'pay'],
    developers: ['MP09']
});
const config = quick.epics['Money Transfer'];
cmd.startingArgs(['player'], true);
cmd.playerType('player', (player, plr, args) => {
    if (player.getScore(config.currency) < args[0])
        return player.error(`You need ${args[0] - player.getScore(config.currency)} more to be able to transfer that amount of money!`);
    if (args[0] > 1000000)
        return player.error('The amount cant be more than 1 Million!');
    if (0 >= args[0])
        return player.error('That is not a number...');
    player.runCommandAsync(`scoreboard players remove @s "${config.obj}" ${args[0]}`);
    plr.runCommandAsync(`scoreboard players add @s "${config.obj}" ${args[0]}`);
    plr.send(`§a${player.name} §eHas gaven you §c${metricNumbers(args[0])} ${config.currency}.`);
    player.send('Transition successfull!');
}, true, 'amount', { self: false });
cmd.numberType('amount', null, null, { min: 1, max: 1000000 });
