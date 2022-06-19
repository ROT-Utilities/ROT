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
import Server from '../../ServerBook.js';
Server.command.register({
    cancelMessage: true,
    name: 'smite',
    description: 'Use this command to punish members for thier wrong doings... Or just for fun.',
    aliases: ['shock', 'power', 'zap', 'launch', 'smyte', 'smyte-network'],
    category: 'Miscellaneous',
    admin: true,
    documentation: {
        usage: 'smite <player?>',
        information: 'This command will give the tartget levitation with an amplifier of 151 for 1 second. It will also summon a lightning bolt where they are standing.',
        examples: [
            'smyte Mo9ses',
            'smite notbeer',
            'smite'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(args[0]) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'SMYTE');
        if(args[0].startsWith('@')) var player = args.join(' '); else {
            player = `"${args.join(' ')}"`;
            if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'SMYTE');
        }
    } else player = `"${chatmsg.sender.name}"`;
    Server.runCommand(`execute "${chatmsg.sender.name}" ~~~ tag ${player} add smite`);
});