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
import config from '../../config.js';
Server.command.register({
    cancelMessage: true,
    name: 'tpa',
    description: `You can use ${Server.lang.prefix}tpa to request ` + (config.tpHere ? 'someone teleport to you, or accept to be teleported' : 'to be teleported to someone, or accept someone to teleport to you'),
    aliases: ['tp', 'tpr', 'tpc', 'tph'],
    category: 'Escape',
    documentation: {
        usage: 'tpa <send|accept|request> <player?>',
        information: 'This command will let players send and accept teleport request from each other. This command supports up to 3 lines and each line last 60 seconds of real world time.',
        examples: [
            'tpa send Mo9ses',
            'tpa cancel'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('tpa', chatmsg.sender.name)) return;
    const accept = ['accept', 'allow', 'take', 's', 'ahead', 'approve'], send = ['send', 'bring', 'shoot', 'give', 'request'], cancel = ['cancel', 'c', 'no', 'not now'];
    if(cancel.includes(args[0])) {
        if(!Server.tpa.has(chatmsg.sender.name)) return Server.eBroadcast('You cannot cancel a TPA that doesn\'t exist!', chatmsg.sender.name, 'TPA');
        Server.tpa.delete(chatmsg.sender.name);
        return Server.broadcast('Your TPA have been §ccanceled§7!', chatmsg.sender.name, 'TPA');
    }
    if(!args[1]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'TPA');
    const player = args.slice(1).join(' ');
    if(player.toUpperCase() === chatmsg.sender.name.toLowerCase()) return Server.eBroadcast('You cannot TPA yourself!', chatmsg.sender.name, 'TPA');
    if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'TPA');
    if(accept.includes(args[0])) {
        if(Server.tpa.get(player)?.receiver !== chatmsg.sender.name) return Server.eBroadcast(`You either didn't get a TP request frem §4${player}§c or the time has ran out!`, chatmsg.sender.name, 'TPA');
        if(config.tpHere) {
            Server.runCommand(`execute "${chatmsg.sender.name}" ~~~ tp "${player}"`);
            Server.broadcast(`§c${chatmsg.sender.name}§7 has been teleported to §4§lYOU§r§7!`, player, 'TPA');
            Server.broadcast(`§4§lYOU§r§7 have been teleported to §c${player}§7!`, chatmsg.sender.name, 'TPA');
        } else {
            Server.runCommand(`execute "${player}" ~~~ tp "${chatmsg.sender.name}"`);
            Server.broadcast(`§c${player}§7 has been teleported to §4§lYOU§r§7!`, chatmsg.sender.name, 'TPA');
            Server.broadcast(`§4§lYOU§r§7 have been teleported to §c${chatmsg.sender.name}§7!`, player, 'TPA');
        }
        return Server.tpa.delete(player);
    }
    if(send.includes(args[0])) {
        if(Server.tpa.has(chatmsg.sender.name)) return Server.eBroadcast('You cannot send a TP request when you already sent one to somebody. Type "§7!tpa cancel§c" in chat to cancel your previous TP request.', chatmsg.sender.name, 'TPA');
        Server.tpa.set(chatmsg.sender.name, {
            sender: chatmsg.sender.name,
            receiver: player,
            timeLeft: Date.now() + (config.tpaTime * 1000)
        }, true);
        Server.broadcast(`Your TPA request has been sent to §c${player}§7!`, chatmsg.sender.name, 'TPA');
        return Server.broadcast(`You have received TPA request from §c${chatmsg.sender.name}§7! You can accept it by typing "§c${Server.lang.prefix}tpa accept ${chatmsg.sender.name}§7" in chat.`, player, 'TPA');
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'TPA');
});
Server.command.register({
    cancelMessage: true,
    name: 'tpat',
    description: `Toggles ${Server.lang.prefix}tpa so people can use ${Server.lang.prefix}tpa how you set it to!`,
    aliases: ['tpatoggle', 'tpa-toggle'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'tpat',
        examples: [
            'tpat'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('tpa', chatmsg.sender.name));