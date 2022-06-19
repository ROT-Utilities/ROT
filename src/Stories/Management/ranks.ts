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
import { getRanks } from '../../Papers/paragraphs/ExtrasParagraphs.js';
Server.command.register({
    cancelMessage: true,
    name: 'rank',
    description: 'Gives players chat ranks! Like [Owner] Mo9ses: Hi!',
    aliases: ['chat', 'say', 'tag', 'chatrank', 'chatranks', 'ranks', 'chats'],
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'rank "<player>" <add|list|remove> <rank>',
        information: 'This command will give or remove a tag from a player that gives them a rank. The rank you give them will NOT affect how they play the game, it will show the rank you give them next to their name in chat. You can manually give members ranks by typing "§c/tag "playername add rank:friend§5".',
        examples: [
            'rank "Mo9ses" add Owner',
            'rank "TSFNM" remove Commander',
            'rank "notbeer" add nerd',
            'rank "Mo9ses" list'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!args.join(' ').match(/(?<=^")([^"]+)(?=")/)) return Server.eBroadcast('Type the player name in quotation marks for the first argument!', chatmsg.sender.name, 'RANKS');
    const player = args.join(' ').match(/(?<=^")([^"]+)(?=")/)[0];
    if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'RANKS');
    const restArgs = args.join(' ').match(new RegExp(`(?<=^"${player}"\\s).+`)),
    add = ['add', 'plus', 'more', 'make', 'put'],
    list = ['list', 'all', 'tell', 'for'],
    remove = ['remove', 'destroy', 'bomb', 'yeet'],
    addRegex = /(add|plus|more|make|put)/,
    revRegex = /(remove|destory|bomb|yeet)/;
    try {
        let args2 = restArgs[0].match(/(add|plus|more|make|put|list|all|tell|for|remove|destory|bomb|yeet)/)[0];
        if(add.includes(args2)) {
            if(restArgs[0].match(addRegex)[0] === '') return Server.eBroadcast('Type the rank you want to give!', chatmsg.sender.name, 'RANKS');
            Server.player.fetch(player).addTag('rank:' + restArgs[0].replace(addRegex, '').replace(/^\s/, ''));
            let ranks = getRanks(player).split('§r§7, ').length - 1;
            return Server.broadcast(`Added rank "§c${restArgs[0].replace(addRegex, '').replace(/^\s/, '')}§r§7" to §4${player}§7! They now have §c${ranks}§7 rank` + (ranks === 0 || ranks >= 2 ? 's' : ''), chatmsg.sender.name, 'RANKS');
        } 
        if(!restArgs || list.includes(args2)) {
            let ranks = getRanks(player).split('§r§7, ');
            return Server.broadcast(`§c${player}§7 has a total of §4${ranks.length - 1}§7 rank${ranks.length - 1 === 0 || ranks.length - 1 >= 2 ? 's' : ''}! Here is a list of them:\n${ranks.join('§r§7,\n')}§r§7.`, chatmsg.sender.name, 'RANKS');
        }
        if(remove.includes(args2)) {
            if(restArgs[0].match(revRegex)[0] === '') return Server.eBroadcast('Type the rank you want to give!', chatmsg.sender.name, 'RANKS');
            Server.player.fetch(player).removeTag('rank:' + restArgs[0].replace(revRegex, '').replace(/^\s/, ''));
            let ranks = getRanks(player).split('§r§7, ').length - 1;
            return Server.broadcast(`Removed rank "§c${restArgs[0].replace(revRegex, '').replace(/^\s/, '')}§r§7" from §4${player}§7! They now have §c${ranks}§7 rank` + (ranks === 0 || ranks >= 2 ? 's' : ''), chatmsg.sender.name, 'RANKS');
        }
    } catch {
        Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'RANKS');
    }
});