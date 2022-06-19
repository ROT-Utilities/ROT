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
import { Location, world } from 'mojang-minecraft';
import Server from '../../ServerBook.js';
Server.command.register({
    cancelMessage: true,
    name: 'spawn',
    description: `When you type ${Server.lang.prefix}spawn in chat, you'll be teleported to spawn!`,
    category: 'Escape',
    aliases: ['spawn', 's', 'hub', 'lobby'],
    documentation: {
        usage: 'spawn <player?>',
        examples: [
            'spawn',
            'spawn Mo9ses',
            'spawn notbeer'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('spawn', chatmsg.sender.name)) return;
    if(args[0]) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'SPAWN');
        if(args[0].startsWith('@')) var player = args.join(' '); else {
            if(!Server.player.find(args.join(' '))) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'SPAWN');
            player = args.join(' ');
        }
    } else player = chatmsg.sender.name;
    if(!Server.settings.get('spawn')) return Server.eBroadcast(Server.player.isAdmin(chatmsg.sender.name) ? Server.lang.spawnNotSetupB : Server.lang.spawnNotSetupA, chatmsg.sender.name, 'SPAWN');
    Server.player.fetch(player).teleport(new Location(Server.settings.get('spawn')[0], Server.settings.get('spawn')[1], Server.settings.get('spawn')[2]), world.getDimension(Server.settings.get('spawn')[3]), 0, 0);
    Server.broadcast('You have been teleported to spawn!', player, 'SPAWN');
});
Server.command.register({
    cancelMessage: true,
    name: 'spawnt',
    description: `Toggles ${Server.lang.prefix}spawn so people can use ${Server.lang.prefix}spawn how you set it to!`,
    aliases: ['spawntoggle', 'spawn-toggle', 'hubt', 'hubtoggle', 'hub-toggle', 'lobbyt', 'lobbytoggle', 'lobby-toggle', 'st'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'spawnt',
        examples: [
            'spawnt'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('spawn', chatmsg.sender.name));
Server.command.register({
    cancelMessage: true,
    name: 'setspawn',
    description: `Sets the area the player will be teleoprted to when they type ${Server.lang.prefix}spawn in chat.`,
    aliases: ['sethub', 'setlobby', 'sets'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'setspawn <X?> <Y?> <Z?>',
        examples: [
            'setspawn',
            'setspawn 25 200 0'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(args[0]) {
        var X = parseInt(args[0]), Y = parseInt(args[1]), Z = parseInt(args[2]);
        if(!X||!Y||!Z) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'SPAWN SETTINGS');
        // @ts-ignore
    } else X = parseInt(chatmsg.sender.location.x), Y = parseInt(chatmsg.sender.location.y), Z = parseInt(chatmsg.sender.location.z);
    if(Math.abs(X) > 5000000 || Math.abs(Y) > 5000000 || Math.abs(Z) > 5000000) return Server.eBroadcast('Yeah, no... No numbers greater than 5 million.', chatmsg.sender.name, 'SETSPAWN');
    Server.broadcast(`The server spawn point has been set to §c${X}§7, §c${Y}§7, §c${Z}§7!`, chatmsg.sender.name, 'SETSPAWN');
    Server.settings.set('spawn', [X, Y, Z, Server.player.getDimension(chatmsg.sender.name)]);
});