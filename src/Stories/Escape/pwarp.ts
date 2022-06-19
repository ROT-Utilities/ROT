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
    name: 'pwarp',
    description: `You can use ${Server.lang.prefix}pwarp to teleport to, set, delete, and list your personal warps around the map!`,
    aliases: ['pwarps', 'pw', 'pwa', 'self-warp', 'ownwarp', 'wp'],
    category: 'Escape',
    documentation: {
        usage: 'pwarp <set|delete|list|tp> <X?> <Y?> <Z?> <name?>',
        examples: [
            'pw tp shop',
            'pwarp tp shop notbeer',
            'pwarp delete shop',
            'pw set shop',
            'pwarps set shop',
            'pwarp list'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('pwarp', chatmsg.sender.name)) return;
    const warps = chatmsg.sender.getTags().join(' '),
        coordFormat = /(?<=[x-zX-Z]:)(-\d+|\d+)/g,
        warp = args[1],
        warpRegex = new RegExp(`\\(N:${warp} X:(-\\d+|\\d+) Y:(-\\d+|\\d+) Z:(-\\d+|\\d+)(.*)\\)`),
        findwarpName = /(?<=\(N:).+?(?= X:(-\d+|\d+) Y:(-\d+|\d+) Z:(-\d+|\d+)\))/g,
        findXYZ = `${warps.match(warpRegex)}`.match(coordFormat),
        listOptions = ['list', 'all'], setOptions = ['set', 'add'], removeOptions = ['remove', 'unadd', 'delete', 'del'], warpOptions = ['warp', 'tp'];
    if(!args.length||listOptions.includes(args[0])) {
        try {
            let allwarps = [];
            for(let theWarp of warps.match(findwarpName)) {
                let allwarpsXYZ = `${warps.match(new RegExp(`\\(N:${theWarp} X:(-\\d+|\\d+) Y:(-\\d+|\\d+) Z:(-\\d+|\\d+)(.*)\\)`))}`.match(coordFormat);
                allwarps.push(`\n${theWarp}§7, Location: §c${allwarpsXYZ[0]}§7 §c${allwarpsXYZ[1]}§7 §c${allwarpsXYZ[2]}§4`);
            }
            if(allwarps.length > 0) return Server.broadcast(`You have total of §c§l${allwarps}/10§r§7 personal warps used!\nHere's the list of them: \n§4§l` + allwarps.join('\n'), chatmsg.sender.name, 'PWARPS');
            return Server.eBroadcast('It seems like YOU haven\'t set any warps, yet-', chatmsg.sender.name, 'PWARPS');
        } catch {
            return Server.eBroadcast('It seems like YOU haven\'t set any warps, yet-', chatmsg.sender.name, 'PWARPS');
        }
    }
    if(setOptions.includes(args[0])) {
        if(!args[1]) return Server.eBroadcast('Please type a UNIQUE warp name to set!', chatmsg.sender.name, 'PWARPS');
        let X = Math.trunc(chatmsg.sender.location.x), Y = Math.trunc(chatmsg.sender.location.y), Z = Math.trunc(chatmsg.sender.location.z);
        if(warp.length > 8) return Server.eBroadcast('Please keep the warp name under §4§l9§r§c characters.', chatmsg.sender.name, 'PWARPS');
        if(warps.match(warpRegex)) Server.eBroadcast('You already have a warp set with that name!', chatmsg.sender.name, 'PWARPS');
        if(Server.player.getDimension(chatmsg.sender.name) !== 'overworld') return Server.eBroadcast('Do to certain limitations you cannot use personal warps in dimensions other than the overworld.', chatmsg.sender.name, 'PWARPS');
        try {
            if(warps.match(findwarpName).length >= 10) return Server.eBroadcast(`You cannot have more than §4§l10§r§c personal warps. You need to delete one of your other warps to create §4${warp}§r§c. If you do not remember all of you warps, type "§7${Server.lang.prefix}pw list§c" in chat.`, chatmsg.sender.name, 'PWARPS');
        } catch {}
        chatmsg.sender.addTag(`"(N:${warp} X:${X} Y:${Y} Z:${Z})"`);
        return Server.broadcast(`You have set a warp with the name §c§l${warp}§r §7at: §c${X}§7, §c${Y}§7, §c${Z}§7!`, chatmsg.sender.name, 'PWARPS');
    }
    if(removeOptions.includes(args[0])) {
        if(!args[1]) return Server.eBroadcast('Please type a warp name to remove!', chatmsg.sender.name, 'PWARPS');
        if(!warps.match(warpRegex)) return Server.eBroadcast('You don\'t have a warp with that name!', chatmsg.sender.name, 'PWARPS');
        chatmsg.sender.removeTag(`"(N:${warp} X:${findXYZ[0]} Y:${findXYZ[1]} Z:${findXYZ[2]})"`);
        return Server.broadcast(`Successfully removed warp with the name §4${warp} §7at §c${findXYZ[0]}§7, §c${findXYZ[1]}§7, §c${findXYZ[2]}§7!`, chatmsg.sender.name, 'PWARPS');
    }
    if(warpOptions.includes(args[0])) {
        if(!args[1]) return Server.eBroadcast(`Type a warp name to warp to bozo!`, chatmsg.sender.name, 'PWARPS');
        if(!warps.match(warpRegex)) return Server.eBroadcast('You don\'t have a warp with that name!', chatmsg.sender.name, 'PWARPS');
        if(Server.player.getDimension(chatmsg.sender.name) !== 'overworld') return Server.eBroadcast('Do to certain limitations you cannot use personal warps in dimensions other than the overworld.', chatmsg.sender.name, 'PWARPS');
        Server.runCommand(`execute ${chatmsg.sender.name} ~~~ tp @s ${findXYZ[0]} ${findXYZ[1]} ${findXYZ[2]}`);
        return Server.broadcast(`You have been teleported to §4${warp}§7 at: §c${findXYZ[0]}§7, §c${findXYZ[1]}§7, §c${findXYZ[2]}`, chatmsg.sender.name, 'PWARPS');
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'PWARPS');
});
Server.command.register({
    cancelMessage: true,
    name: 'pwarpt',
    description: `Toggles ${Server.lang.prefix}pwarp so members can use ${Server.lang.prefix}pwarp how you set it to!`,
    aliases: ['pwtoggle', 'pw-toggle', 'pwarptoggle', 'pwarp-toggle', 'pwarpstoggle', 'pwarps-toggle', 'pwt', 'pwat', 'pawg'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'warpt',
        examples: [
            'warpt'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('pwarp', chatmsg.sender.name));