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
import { twoStepKick } from '../../Papers/paragraphs/ExtrasParagraphs.js';
const timeFormatRegex = /^\d+\.?\d*\s?((years*?|yrs*?)|(weeks*?)|(days*?)|(hours*?|hrs*?)|(minutes*?|mins*?)|(seconds*?|secs*?)|(milliseconds*?|msecs*?|ms)|[smhdwy])(?!\S)(?=\s?)/;
Server.command.register({
    cancelMessage: true,
    name: 'ban',
    description: 'A simple ban command...',
    aliases: ['kick', 'tempban', 'bam'],
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'ban "<player>" <time> <reason>',
        information: 'This command will kick members out of the server for a certain amount of time. Yes, it goes by real world time even when server is closed.',
        examples: [
            'ban "notbeer" 30 minutes Using foul language',
            'tempban "notbeer" 10 hours Bullying player',
            'ban "notbeer" 1 day Spamming chat',
            'ban "notbeer" 4'
        ],
        developers: ['notbeer', 'Mo9ses']
    }
}, (chatmsg, args) => {
    if(!/(?<=^")([^"]+)(?=")/.test(args.join(' '))) return Server.eBroadcast('Type the player name in quotations for the first argument', chatmsg.sender.name, 'BAN');
    const player = args.join(' ').match(/(?<=^")([^"]+)(?=")/)[0];
    if(player === chatmsg.sender.name) return Server.eBroadcast('You cannot ban yourself bozo', chatmsg.sender.name, 'BAN');
    if(Server.player.isAdmin(player)) return Server.eBroadcast('You may not ban a staff member!', chatmsg.sender.name, 'BAN');
    if(Server.bans.has(player)) return Server.eBroadcast(`Player "§4${player}§c" is already banned...`, chatmsg.sender.name, 'BAN');
    let restArgs = args.join(' ').match(new RegExp(`(?<=^"${player}"\\s).+`));
    if(!restArgs||!restArgs[0].match(timeFormatRegex)) return Server.eBroadcast(`${restArgs ? 'Invalid' : 'Missing'} ban length argument`, chatmsg.sender.name, 'BAN');
    const time = MS(restArgs[0].match(timeFormatRegex)[0]),
        reason = restArgs[0].replace(timeFormatRegex, '').replace(/^\s/, ''),
        today = new Date(),
        banData = {
            bannedPlayer: player,
            date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
            length: time,
            unbanTime: today.getTime() + time,
            reason: reason,
            bannedBy: chatmsg.sender.name,
            playerUUID: Server.player.getScore('ROTplayerUUID', player)
        };
    Server.bans.set(player, banData, true);
    Server.broadcast(`Successfully banned §c${player}§7 for §c${restArgs[0].match(timeFormatRegex)[0]}§7${reason ? ` for "§c${reason}§r§7"` : ''}!`, '@a', 'BAN');
    twoStepKick(Server.player.fetch(player), banData);
});
Server.command.register({
    cancelMessage: true,
    name: 'banlist',
    description: 'Lists all banned players in this server and the time the ban will be lifted',
    aliases: ['banall', 'bans', 'bl', 'blm'],
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'bans "<player?>"',
        information: 'This command will list all the banned players or tell you information about the current player that is banned',
        examples: [
            'bans',
            'banall "Mo9ses"',
            'banlist "notbeer"'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    const today = new Date().getTime();
    if(args[0]) {
        if(!/(?<=^")([^"]+)(?=")/.test(args.join(' '))) return Server.eBroadcast('Type the player name in quotations for the first argument', chatmsg.sender.name, 'BAN');
        const player = args.join(' ').match(/(?<=^")([^"]+)(?=")/)[0], ban = Server.bans.get(player);
        if(player === chatmsg.sender.name) return Server.eBroadcast('You are not even banned...', chatmsg.sender.name, 'BANS');
        if(!Server.bans.has(player)) return Server.eBroadcast(`No player with the name "§4${player}§c" is banned`, chatmsg.sender.name, 'BANS');
        return Server.broadcast(`§c${player}§7 was banned on §c${ban?.date}§7 by §c${ban?.bannedBy}§r§7 for §c${MS(ban?.length)}§7 ${ban?.reason ? `for the reason "§c${ban?.reason}§r§7".` : 'with an undefined reason...'} They will be unbanned in §c${MS(ban?.unbanTime-today)}§7!`, chatmsg.sender.name, 'BANS');
    }
    let allBannedplayers = [], bannedPlayers = Server.bans.getCollection();
    if(!bannedPlayers) return Server.eBroadcast('There are currently NO banned players in this server!', chatmsg.sender.name, 'BANS');
    for(let key in bannedPlayers) if(bannedPlayers.hasOwnProperty(key) && bannedPlayers[key]?.bannedPlayer) allBannedplayers.push(bannedPlayers[key]?.bannedPlayer + '§7 - §e' + MS(bannedPlayers[key]?.unbanTime-today));
    Server.broadcast(`There are currently §c${allBannedplayers.length}§7 banned players!. You can find more info about the player who was banned by typing for example '§c!bans "Mo9ses"§7' in chat\n§c` + allBannedplayers.join('\n§c'), chatmsg.sender.name, 'BANS');
});
Server.command.register({
    cancelMessage: true,
    name: 'unban',
    description: 'Unban an banned player',
    aliases: ['unkick'],
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'unban "<player>"',
        information: 'You can use this command to unban members that have been banned on your server.',
        examples: [
            'unban "notbeer"',
            'unban "Mo9ses"',
        ],
        developers: ['notbeer']
    }
}, (chatmsg, args) => {
    if(!args.join(' ').match(/(?<=^")([^"]+)(?=")/)) return Server.eBroadcast('Type the player name in quotation marks for the first argument!', chatmsg.sender.name, 'UNBAN');
    const player = args.join(' ').match(/(?<=^")([^"]+)(?=")/)[0];
    if(player === chatmsg.sender.name) return Server.eBroadcast('You are not even banned...', chatmsg.sender.name, 'UNBAN');
    if(!Server.bans.has(player)) return Server.eBroadcast(`No player with the name "§4${player}§c" is banned`, chatmsg.sender.name, 'UNBAN');
    Server.bans.delete(player);
    Server.broadcast(`§a${player} §chas been unbanned!`, chatmsg.sender.name, 'UNBAN');
});