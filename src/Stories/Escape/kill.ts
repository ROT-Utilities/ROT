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
    name: 'kill',
    description: `When you type ${Server.lang.prefix}kill in chat... I'll kill you!`,
    category: 'Escape',
    aliases: ['death', 'die'],
    documentation: {
        usage: 'kill <player?>',
        examples: [
            'kill',
            'kill notbeer',
            'kill furries'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('kill', chatmsg.sender.name)) return;
    if(args.join(' ') !== '') {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'KILL');
        if(args.join(' ').startsWith('@')) var player = args.join(' '); else {
            if(!Server.player.find(args.join(' '))) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'KILL');
            player = `"${args.join(' ')}"`;
        }
    } else player = `"${chatmsg.sender.name}"`;
    Server.broadcast('You have been killed!', player, 'KILL');
    Server.runCommand(`effect ${player} instant_damage 32767 255 true`);
});
Server.command.register({
    cancelMessage: true,
    name: 'killt',
    description: `Toggles ${Server.lang.prefix}kill so people can use ${Server.lang.prefix}kill how you set it to!`,
    aliases: ['killtoggle', 'kill-toggle', 'deatht', 'deathtoggle', 'death-toggle', 'diet', 'dietoggle', 'die-toggle'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'killt',
        examples: [
            'killt'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('kill', chatmsg.sender.name));