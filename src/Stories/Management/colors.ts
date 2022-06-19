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
import { getColors } from '../../Papers/paragraphs/ExtrasParagraphs.js';
Server.command.register({
    cancelMessage: true,
    name: 'color',
    description: 'Changes the name color for a member for leaderboards, chat, etc...',
    aliases: ['chatcolor', 'chatcolors', 'colors'],
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'color "<player>" <add|list|remove> <color>',
        information: 'This command will give or remove a tag from a player that gives them a color. The color you give them will NOT affect how they play the game, it will show the color you give them next to their name in chat. You can manually give members colors by typing "§c/tag "playername add color:§5".',
        examples: [
            'color "Mo9ses" add 5',
            'color "TSFNM" remove l',
            'color "notbeer" add b',
            'color "Mo9ses" list'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!args.join(' ').match(/(?<=^")([^"]+)(?=")/)) return Server.eBroadcast('Type the player name in quotation marks for the first argument!', chatmsg.sender.name, 'COLORS');
    const player = args.join(' ').match(/(?<=^")([^"]+)(?=")/)[0];
    if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'COLORS');
    const restArgs = args.join(' ').match(new RegExp(`(?<=^"${player}"\\s).+`)),
    add = ['add', 'plus', 'more', 'make', 'put'],
    list = ['list', 'all', 'tell', 'for'],
    remove = ['remove', 'destroy', 'bomb', 'yeet'],
    addRegex = /(add|plus|more|make|put)/,
    revRegex = /(remove|destory|bomb|yeet)/;
    try {
        const args2 = restArgs[0].match(/(add|plus|more|make|put|list|all|tell|for|remove|destory|bomb|yeet)/)[0];
        if(add.includes(args2)) {
            if(restArgs[0].match(addRegex)[0] === '') return Server.eBroadcast('Type the color you want to give!', chatmsg.sender.name, 'COLORS');
            if(restArgs[0].replace(addRegex, '').replace(/^\s/, '').length > 1) return Server.eBroadcast('You must type a color! Join the ROT Discord for more help: §ehttps://discord.com/invite/2ADBWfcC6S', chatmsg.sender.name, 'COLORS');
            Server.player.fetch(player).addTag('color:§' + restArgs[0].replace(addRegex, '').replace(/^\s/, ''));
            const colors = getColors(player).split('§').splice(1).length;
            return Server.broadcast(`Added color "§c${restArgs[0].replace(addRegex, '').replace(/^\s/, '')}§r§7" to ${getColors(player) + player}§r§7! They now have §c${colors}§7 color` + (colors === 0 || colors >= 2 ? 's' : ''), chatmsg.sender.name, 'COLORS');
        } 
        if(!restArgs||list.includes(args2)) {
            const colors = getColors(player).split('§').splice(1).map(color => {return color + 'color'});
            return Server.broadcast(getColors(player) + player + `§r§7 has a total of §4${colors.length}§7 color${colors.length === 0 || colors.length >= 2 ? 's' : ''}! Here is a list of them:\n§${colors.join('§r§7,\n§')}§r§7.`, chatmsg.sender.name, 'COLORS');
        }
        if(remove.includes(args2)) {
            if(restArgs[0].match(revRegex)[0] === '') return Server.eBroadcast('Type the color you want to give!', chatmsg.sender.name, 'COLORS');
            Server.player.fetch(player).removeTag('color:§' + restArgs[0].replace(revRegex, '').replace(/^\s/, ''));
            const colors = getColors(player).split('§').splice(1).length;
            return Server.broadcast(`Removed color "§c${restArgs[0].replace(revRegex, '').replace(/^\s/, '')}§r§7" from ${getColors(player) + player}§r§7! They now have §c${colors}§7 color` + (colors === 0 || colors >= 2 ? 's' : ''), chatmsg.sender.name, 'COLORS');
        }
    } catch {
        Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'COLORS');
    }
});