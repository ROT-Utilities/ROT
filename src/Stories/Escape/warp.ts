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
import { world, Location } from 'mojang-minecraft';
import { DatabasePaper } from '../../Papers/DatabasePaper.js';
import Server from '../../ServerBook.js';
Server.command.register({
    cancelMessage: true,
    name: 'warp',
    description: `You can use ${Server.lang.prefix}warp to teleport to, set, delete, and list warps around the map!`,
    aliases: ['warps', 'serverwarps', 'serverwarps', 'wa', 'w'],
    category: 'Escape',
    documentation: {
        usage: 'warp <set|delete|list|tp|rename|settag> <name?> <X?|tag?|name?|player?> <Y?> <Z?>',
        examples: [
            'w shop',
            'warp shop notbeer',
            'warp delete shop',
            'w shop',
            'warps set shop 42 53 1234',
            'warp list',
            'warp shop',
            'warp home',
            'warp settag shop shoppeople'
        ],
        developers: ['notbeer', 'Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('warp', chatmsg.sender.name)) return;
    const warps = new DatabasePaper('Wrps'), listOptions = ['list', 'all'], setOptions = ['set', 'add'], removeOptions = ['remove', 'delete', 'del'], rename = ['rename', 'rn'], setTag = ['tag', 'settag'];
    if(!args.length || listOptions.includes(args[0])) {
        const allWarps = warps.allKeys().filter((warp: string) => {
            if(!warps.get(warp)[4]) return true;
            if(Server.player.isAdmin(chatmsg.sender.name)) return true;
            if(chatmsg.sender.hasTag(warps.get(warp)[4])) return true;
        });
        if(allWarps[0]) return Server.broadcast(`This server has total of §c${allWarps.length}§7 warp(s)! Here's the list of the server's warps: \n§4§l` + allWarps.map((warp: string) => {
            if(!warps.get(warp)[3]) warps.set(warp, [warps.get(warp), 'overworld'].flat());
            return warp + `§7, Location: §c${warps.get(warp)[0]}§7, §c${warps.get(warp)[1]}§7, §c${warps.get(warp)[2]}§7, §dDimension: §c${warps.get(warp)[3]}§4`
        }).join('\n'), chatmsg.sender.name, 'WARPS');
        return Server.eBroadcast('It seems like this server hasen\'t set any warps, yet-', chatmsg.sender.name, 'WARPS');
    }
    if(setOptions.includes(args[0])) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'WARPS');
        if(!args[1] || ['list', 'all', 'set', 'add', 'remove', 'delete', 'del'].includes(args[1])) return Server.eBroadcast('Please type a UNIQUE warp name to set!', chatmsg.sender.name, 'WARPS');
        if(args[2]) {
            if(!args[2]||!args[3]||!args[4]) return Server.eBroadcast(`You need to type the full coordinates, or you can just type "§7${Server.lang.prefix}warp set ${args[1]}§c" to set it where you player is currently at.`, chatmsg.sender.name, 'WARPS');
            var X = parseInt(args[2]), Y = parseInt(args[3]), Z = parseInt(args[4]);
            if(!X||!Y||!Z) return Server.eBroadcast(`You need to type the full coordinates, or you can just type "§7${Server.lang.prefix}warp set ${args[1]}§c" to set it where you player is currently at.`, chatmsg.sender.name, 'WARPS');
            // @ts-ignore
        } else X = parseInt(chatmsg.sender.location.x), Y = parseInt(chatmsg.sender.location.y), Z = parseInt(chatmsg.sender.location.z);
        const warp = args[1];
        if(warp.length > 12) return Server.eBroadcast('The warp name has to be §4§l12§r§c characters or less.', chatmsg.sender.name, 'WARPS');
        warps.set(warp, [X, Y, Z, Server.player.getDimension(chatmsg.sender.name)], true);
        return Server.broadcast(`You have set a warp with the name §4§l${warp}§r§7 at: §c${X}§7, §c${Y}§7, §c${Z}, §dDimension: §c${Server.player.getDimension(chatmsg.sender.name)}§7!`, chatmsg.sender.name, 'WARPS');
    }
    if(removeOptions.includes(args[0])) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'WARPS');
        if(!args[1]) return Server.eBroadcast('Type a warp name to remove!', chatmsg.sender.name, 'WARPS');
        if(!warps.has(args[1])) return Server.eBroadcast('This server doesn\'t have a warp with that name!', chatmsg.sender.name, 'WARPS');
        if(!warps.get(args[1])[3]) warps.set(args[1], [warps.get(args[1]), 'overworld'].flat());
        Server.broadcast(`Successfully removed warp with the name §4${args[1]} §7at §c${warps.get(args[1])[0]}§7, §c${warps.get(args[1])[1]}§7, §c${warps.get(args[1])[2]}§7, §dDimension: §c${warps.get(args[1])[3]}§7!`, chatmsg.sender.name, 'WARPS');
        return warps.delete(args[1]);
    }
    if(rename.includes(args[0])) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'WARPS');
        if(!args[1]) return Server.eBroadcast('Type a warp name!', chatmsg.sender.name, 'WARPS');
        if(!args[2]) return Server.eBroadcast('Type a warp name that will replace the old warp name!', chatmsg.sender.name, 'WARPS');
        if(!warps.has(args[1])) return Server.eBroadcast('This server doesn\'t have a warp with that name!', chatmsg.sender.name, 'WARPS');
        Server.broadcast(`Successfully renamed the warp §c${args[1]} §7to §c${args[2]}§7!`, chatmsg.sender.name, 'WARPS');
        warps.set(args[2], warps.get(args[1]), true);
        return warps.delete(args[1]);
    }
    if(setTag.includes(args[0])) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'WARPS');
        if(!args[1]) return Server.eBroadcast('Type a warp name!', chatmsg.sender.name, 'WARPS');
        if(!args[2] || args[3]) return Server.eBroadcast('Type a tag (With no spaces)!', chatmsg.sender.name, 'WARPS');
        if(!warps.has(args[1])) return Server.eBroadcast('This server doesn\'t have a warp with that name!', chatmsg.sender.name, 'WARPS');
        if(!warps.get(args[1])[3]) warps.set(args[1], [warps.get(args[1]), 'overworld'].flat());
        Server.broadcast(`Successfully set the required tag for §c${args[1]} §7is now §c${args[2]}§7! Members will need this tag to be able to see the warp in their available warps, and to be able to teleport to it.`, chatmsg.sender.name, 'WARPS');
        const spliced =  warps.get(args[1]); spliced.splice(4, 1, args[2]);
        return warps.set(args[1], warps.get(args[1])[4] ? spliced : [warps.get(args[1]), args[2]].flat());
    }
    if(!args[0]) return Server.eBroadcast(`Type a warp name to warp to!`, chatmsg.sender.name, 'WARP');
    if(!warps.has(args[0])) return Server.eBroadcast('This server doesn\'t have a warp with that name!', chatmsg.sender.name, 'WARP');
    if(!warps.get(args[0])[3]) warps.set(args[0], [warps.get(args[0]), 'overworld'].flat());
    if(args[1]) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'WARPS');
        var player = args.slice(1).join(' ');
        if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'DIM');
    } else player = chatmsg.sender.name;
    if(player === chatmsg.sender.name && warps.get(args[0])[4] && !chatmsg.sender.hasTag(warps.get(args[0])[4]) && !Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast('This server doesn\'t have a warp with that name!', chatmsg.sender.name, 'WARPS');
    Server.player.fetch(player).teleport(new Location(warps.get(args[0])[0], warps.get(args[0])[1], warps.get(args[0])[2]), world.getDimension(warps.get(args[0])[3]), 0, 0);
    Server.broadcast(`You have been teleported to §4§l${args[0]}§r§7 at: §c${warps.get(args[0])[0]}§7, §c${warps.get(args[0])[1]}§7, §c${warps.get(args[0])[2]}§7, §dDimension: §c${warps.get(args[0])[3]}§7!`, player, 'WARPS');
});
Server.command.register({
    cancelMessage: true,
    name: 'warpt',
    description: `Toggles ${Server.lang.prefix}warp so members can use ${Server.lang.prefix}warp how you set it to!`,
    aliases: ['wtoggle', 'w-toggle', 'warptoggle', 'warp-toggle', 'warpstoggle', 'warps-toggle'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'warpt',
        examples: [
            'warpt'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('warp', chatmsg.sender.name));