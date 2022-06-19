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
import { MS } from '../../Papers/paragraphs/ConvertersParagraphs.js';
const timeFormatRegex = /^\d+\.?\d*\s?((years*?|yrs*?)|(weeks*?)|(days*?)|(hours*?|hrs*?)|(minutes*?|mins*?)|(seconds*?|secs*?)|(milliseconds*?|msecs*?|ms)|[smhdwy])(?!\S)(?=\s?)/;
Server.command.register({
    cancelMessage: true,
    name: 'mute',
    description: 'Makes it so a player can no longer talk in chat',
    aliases: ['m', 'shush', 'quiet', 'silence'],
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'mute "<player>" <time> <reason?>',
        information: 'This command allows admins to mute players so they can no longer type in chat.',
        examples: [
            'mute "RandomDude" 24 hours Too loud!',
            'mute "notbeer" 30 seconds Test',
            'mute "Mo9ses" 5000 years ROT is BEST'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!/(?<=^")([^"]+)(?=")/.test(args.join(' '))) return Server.eBroadcast('Type the player name in quotations for the first argument', chatmsg.sender.name, 'MUTE');
    const player = args.join(' ').match(/(?<=^")([^"]+)(?=")/)[0];
    if(player === chatmsg.sender.name) return Server.eBroadcast('You cannot mute yourself I dot', chatmsg.sender.name, 'MUTE');
    if(Server.player.isAdmin(player)) return Server.eBroadcast('You may not mute a staff member!', chatmsg.sender.name, 'MUTE');
    if(Server.mutes.has(player)) return Server.eBroadcast(`Player "§4${player}§c" is already muted...`, chatmsg.sender.name, 'MUTE');
    let restArgs = args.join(' ').match(new RegExp(`(?<=^"${player}"\\s).+`));
    if(!restArgs||!restArgs[0].match(timeFormatRegex)) return Server.eBroadcast(`${restArgs ? 'Invalid' : 'Missing'} mute length argument!`, chatmsg.sender.name, 'MUTE');
    const time = MS(restArgs[0].match(timeFormatRegex)[0]),
    reason = restArgs[0].replace(timeFormatRegex, '').replace(/^\s/, ''),
    today = new Date();
    Server.mutes.set(player, {
        mutedPlayer: player,
        date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
        length: time,
        unmuteTime: today.getTime() + time,
        reason: reason,
        mutedBy: chatmsg.sender.name,
        playerUUID: Server.player.getScore('ROTplayerUUID', player)
    }, true);
    Server.broadcast(`Successfully muted §c${player}§7 for §c${restArgs[0].match(timeFormatRegex)[0]}§7${reason ? ` for "§c${reason}§r§7"` : ''}!`, chatmsg.sender.name, 'MUTES');
});
Server.command.register({
    cancelMessage: true,
    name: 'mutelist',
    description: 'Lists all muted players in this server and the time they will be able to talk',
    aliases: ['mutes', 'ml', 'muteall'],
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'mutes "<player?>"',
        information: 'This command will list all the muted players or tell you information about the current player that is muted',
        examples: [
            'mutes',
            'mutelist "Mo9ses"',
            'ms "notbeer"'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    const today = new Date();
    if(args[0]) {
        if(!/(?<=^")([^"]+)(?=")/.test(args.join(' '))) return Server.eBroadcast('Type the player name in quotations for the first argument', chatmsg.sender.name, 'MUTES');
        const player = args.join(' ').match(/(?<=^")([^"]+)(?=")/)[0], mute = Server.mutes.get(player);
        if(player === chatmsg.sender.name) return Server.eBroadcast('You are not even muted...', chatmsg.sender.name, 'MUTES');
        if(!Server.mutes.has(player)) return Server.eBroadcast(`No player with the name "§4${player}§c" is muted`, chatmsg.sender.name, 'MUTES');
        return Server.broadcast(`§c${player}§7 was muted on §c${mute?.date}§7 by §c${mute?.mutedBy}§r§7 for §c${MS(mute?.length)}§7 ${mute?.reason ? `for the reason "§c${mute?.reason}§r§7".` : 'with an undefined reason...'} They will be unmuted in §c${MS(mute?.unmuteTime-today.getTime())}§7!`, chatmsg.sender.name, 'MUTES');
    }
    let allMutedplayers = [], mutedPlayers = Server.mutes.getCollection();
    if(!mutedPlayers) return Server.eBroadcast('There are currently NO muted players in this server!', chatmsg.sender.name, 'MUTES');
    for(let key in mutedPlayers) if(mutedPlayers.hasOwnProperty(key) && mutedPlayers[key]?.mutedPlayer) allMutedplayers.push(mutedPlayers[key]?.mutedPlayer + '§7 - §e' + MS(mutedPlayers[key]?.unmuteTime-today.getTime()));
    Server.broadcast(`There are currently §c${allMutedplayers.length}§7 muted players! You can find more info about the player who was muted by typing for example '§c!mutes "Mo9ses"§7' in chat\n§c` + allMutedplayers.join('\n§c'), chatmsg.sender.name, 'MUTES');
});
Server.command.register({
    cancelMessage: true,
    name: 'unmute',
    description: 'Unmute players that have been muted by ROT or an admin of this server!',
    aliases: ['unm', 'unshush', 'unquiet', 'unsilence', 'talk', 'sorry'],
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'unmute <player>',
        information: 'This command will unmute a player that has been previously muted by ROT or a admin earlier than their expected time.',
        examples: [
            'unmute "Mo9ses"',
            'unmute "notbeer"'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!args.join(' ').match(/(?<=^")([^"]+)(?=")/)) return Server.eBroadcast('Type the player name in quotation marks for the first argument!', chatmsg.sender.name, 'UNMUTE');
    const player = args.join(' ').match(/(?<=^")([^"]+)(?=")/)[0];
    if(player === chatmsg.sender.name) return Server.eBroadcast('You are not even muted...', chatmsg.sender.name, 'UNMUTE');
    if(!Server.mutes.has(player)) return Server.eBroadcast(`No player with the name "§4${player}§c" is muted`, chatmsg.sender.name, 'UNMUTE');
    Server.mutes.delete(player);
    Server.broadcast(`§a${player} §chas been unmuted!`, chatmsg.sender.name, 'UNMUTE');
});