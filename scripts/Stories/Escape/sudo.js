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
import { world } from '@minecraft/server';
import Server from '../../ServerBook.js';
const cmd = Server.command.create({
    name: 'sudo',
    description: `Sudo command`,
    aliases: ['sd'],
    category: 'Escape',
    admin: true,
    developers: ['Aex66']
});
cmd.startingArgs(['message', 'leave', 'join', 'death']);
cmd.dynamicType('join', 'join', (plr, _, args) => world.say(joinMsgFormat(args[0])), 'playerName');
cmd.dynamicType('leave', 'leave', (plr, _, args) => world.say(leaveMsgFormat(args[0])), 'playerName');
cmd.dynamicType('death', 'death', (plr, _, args) => world.say(deathMsgFormat(args[0])), 'playerName');
cmd.dynamicType('message', 'message', (plr, _, args) => world.say(msgFormat(args[0], args[1])), 'playerName2');
cmd.playerType('playerName', null, false);
cmd.playerType('playerName2', null, false, 'msg');
cmd.dynamicType('msg', '*', null);
const joinMsgFormat = (name) => `§e${name} joined the game`, leaveMsgFormat = (name) => `§e${name} left the game`, msgFormat = (name, msg) => `§r<${name}> ${msg}`, deathMsgFormat = (name) => `${name} ${DeathMsgs[~~(Math.random() * DeathMsgs.length)]}`;
const DeathMsgs = [
    'tried to swim in lava',
    'went up in flames',
    'discovered floor was lava',
    'drowned',
    'fell out of the world',
    'fell from a high place',
    'was slain by warden',
    'was obliterated by a sonically-charged shriek whilst trying to escape Warden',
    'was slain by Zombie',
    'burned to death',
    'was spined by shulker',
    'withered away',
    'was pricked to death',
    'hit the ground too hard',
    'experienced kinetic energy',
    'blew up',
    'was impaled on a stalagmite',
    'was squashed by a falling block',
    'was skewered by a falling stalactite',
    'was struck by lightning',
    'was killed by magic',
    'froze to death',
    'starved to death',
    'suffocated in a wall',
    'was poked to death by a sweet berry bush',
    'died'
];
