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
    name: 'gma',
    description: 'Switches your or other members to adventure mode more easily',
    aliases: ['gamemodea', 'modea', 'gm2'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'gma',
        examples: [
            'gma'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('gma', chatmsg.sender.name)) return;
    let player = chatmsg.sender.name;
    if(args[0]) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'GMA');
        player = args.join(' ');
        if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'GMA');
        Server.broadcast(`§c${player}§7 is now in adventure mode!`, chatmsg.sender.name, 'GMA');
    }
    Server.runCommand('gamemode a ' + player);
    Server.broadcast('You are now in adventure mode!', player, 'GMA');
});
Server.command.register({
    cancelMessage: true,
    name: 'gmat',
    description: `Toggles ${Server.lang.prefix}gma so people can use ${Server.lang.prefix}gma how you set it to`,
    aliases: ['gmatoggle', 'gma-toggle', 'gmat'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'gmat',
        examples: [
            'gmat'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('gma', chatmsg.sender.name));