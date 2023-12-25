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
import Server from "../../Papers/ServerPaper.js";
const cmd = Commands.create({
    name: 'smite',
    description: 'Smites a player',
    aliases: ['sm', 'ite', 'slap', 'godslap'],
    category: 'Miscellaneous',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs('player');
cmd.playerType('player', (player, target) => {
    target.dimension.spawnEntity('minecraft:lightning_bolt', target.location);
    target.addEffect('levitation', 20, { amplifier: 100, showParticles: false });
    target.runCommand('camerashake add @a[r=15] 0.6 0.4 rotational');
    if (player.name === target.name)
        return Server.broadcast(`§a§l${player.name}§6 has smited themself!?`);
    Server.broadcast(`§a§l${target.name}§6 has been smited by §c${player.name}!`);
});
