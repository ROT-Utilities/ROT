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
    name: 'home',
    description: `You can use this commmand to set, teleport, and delete your home`,
    category: 'Escape',
    aliases: ['h', 'house'],
    documentation: {
        usage: 'home <set|delete|tp>',
        information: 'This command will make it so players can set warps anywhere they want around the world so they can be teleported to it.',
        examples: [
            'home set',
            'house tp',
            'h delete',
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('home', chatmsg.sender.name)) return;
    const set = ['set', 'create', 'make'], del = ['delete', 'remove', 'kill', 'yeet', 'del'], tp = ['tp', 'teleport', 't', 'goto', 'go', 'to'];
    if(set.includes(args[0])) {
        if(Server.player.getDimension(chatmsg.sender.name) !== 'overworld') return Server.eBroadcast('Do to certain limitations you cannot use homes in dimensions other than the overworld.', chatmsg.sender.name, 'HOME');
        Server.runCommands([
            `scoreboard players set "${chatmsg.sender.name}" ROThomeX ` + Math.trunc(chatmsg.sender.location.x),
            `scoreboard players set "${chatmsg.sender.name}" ROThomeY ` + Math.trunc(chatmsg.sender.location.y),
            `scoreboard players set "${chatmsg.sender.name}" ROThomeZ ` + Math.trunc(chatmsg.sender.location.z)
        ]);
        return Server.broadcast(`Your home has been set to §c${Math.trunc(chatmsg.sender.location.x)}§7, §c${Math.trunc(chatmsg.sender.location.y)}§7, §c${Math.trunc(chatmsg.sender.location.z)}§7!`, chatmsg.sender.name, 'HOME');
    }
    if(del.includes(args[0])) {
        if(Server.player.getScore('ROThomeX', chatmsg.sender.name) === undefined) return Server.eBroadcast(`You do not have a home to delete! You can make one by typing "§7${Server.lang.prefix}home set§c" in chat.`, chatmsg.sender.name, 'HOME');
        Server.broadcast(`Your home at §c${Server.player.getScore('ROThomeX', chatmsg.sender.name)}§7, §c${Server.player.getScore('ROThomeY', chatmsg.sender.name)}§7, §c${Server.player.getScore('ROThomeZ', chatmsg.sender.name)}§7 has been §4§lDELETED§r§7!`, chatmsg.sender.name, 'HOME');
        return Server.runCommands([
            `scoreboard players reset "${chatmsg.sender.name}" ROThomeX`,
            `scoreboard players reset "${chatmsg.sender.name}" ROThomeY`,
            `scoreboard players reset "${chatmsg.sender.name}" ROThomeZ`
        ]);
    }
    if(!args.length||tp.includes(args[0])) {
        if(Server.player.getScore('ROThomeX', chatmsg.sender.name) === undefined) return Server.eBroadcast(`You do not have a home to teleport to! You can make one by typing "§7${Server.lang.prefix}home set§c" in chat.`, chatmsg.sender.name, 'HOME');
        if(Server.player.getDimension(chatmsg.sender.name) !== 'overworld') return Server.eBroadcast('Do to certain limitations you cannot use homes in dimensions other than the overworld.', chatmsg.sender.name, 'HOME');
        Server.runCommand(`execute "${chatmsg.sender.name}" ~~~ tp @s ${Server.player.getScore('ROThomeX', chatmsg.sender.name)} ${Server.player.getScore('ROThomeY', chatmsg.sender.name)} ` + Server.player.getScore('ROThomeZ', chatmsg.sender.name));
        return Server.broadcast(`You have been teleported to your home at §c${Server.player.getScore('ROThomeX', chatmsg.sender.name)}§7, §c${Server.player.getScore('ROThomeY', chatmsg.sender.name)}§7, §c${Server.player.getScore('ROThomeZ', chatmsg.sender.name)}§7!`, chatmsg.sender.name, 'HOME');
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'HOME');
});
Server.command.register({
    cancelMessage: true,
    name: 'homet',
    description: `Toggles ${Server.lang.prefix}home so people can use ${Server.lang.prefix}home how you set it to`,
    aliases: ['hometoggle', 'home-toggle', 'housetoggle', 'house-toggle'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'homet',
        examples: [
            'homet'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('home', chatmsg.sender.name));