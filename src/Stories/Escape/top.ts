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
    name: 'top',
    description: `When you type ${Server.lang.prefix}top in chat... I'll teleport you to the highest point above your player!`,
    category: 'Escape',
    aliases: ['highest', 'point'],
    documentation: {
        usage: 'top <player?>',
        examples: [
            'top',
            'top Mo9ses',
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('top', chatmsg.sender.name)) return;
    if(args[0]) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'TOP');
        if(args[0].startsWith('@')) var player = args.join(' '); else {
            if(!Server.player.find(args.join(' '))) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'TOP');
            player = `"${args.join(' ')}"`;
        }
    } else player = `"${chatmsg.sender.name}"`;
    Server.broadcast('You have been teleported to the highest point above your player\'s last location!', player, 'TOP');
    Server.runCommands([`execute ${player} ~~~ tp @s ~ 330 ~`, `execute ${player} ~~~ effect @s resistance 15 255 true`]);
});
Server.command.register({
    cancelMessage: true,
    name: 'topt',
    description: `Toggles ${Server.lang.prefix}top so people can use ${Server.lang.prefix}top how you set it to.`,
    aliases: ['toptoggle'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'topt',
        examples: [
            'topt'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('top', chatmsg.sender.name));