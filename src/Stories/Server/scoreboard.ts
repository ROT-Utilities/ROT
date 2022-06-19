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
import { getColors, getRanks } from '../../Papers/paragraphs/ExtrasParagraphs.js';
import { metricNumbers } from '../../Papers/paragraphs/ConvertersParagraphs.js';
Server.command.register({
    cancelMessage: true,
    name: 'sc',
    description: 'Make a personal custom sidebar for players!',
    aliases: ['score', 'board', 'scoreboard', 'sidebar', 'personal-sidebar','sb'],
    category: 'Server',
    admin: true,
    documentation: {
        usage: 'sc <create|preview|setline|removeline|settag|remove|list|clone> <text|number|true/false|tag> <number|tag|text>  <number|tag|text>',
        information: 'Use this command to make a personal sidebar/scoreboard for players. ROT texture pack needed',
        examples: [
            'sc create lobby',
            'sc preview lobby',
            'sc setline lobby 1 Hello (rank) (name)!',
            'sc setline lobby 2 Money: (score:money)',
            'sc setline lobby 3 Oops!',
            'sc removeline lobby 3',
            'sc settag lobby hub',
            'sc list'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    const create = ['create','make','add','new','c'], preview = ['show','unhide','hide','now','p','preview','pushingp'], setline = ['setline','addline','newline','sl'], removeline = ['delline','d','removeline'], settag = ['st','settag','maketag'], remove = ['remove','del','bomb','delete'], list = ['list','l','all','more'], sc = Server.sc;
    if(create.includes(args[0])) {
        if(sc.has(args[1])) return Server.eBroadcast(`This server already has the sidebar "§4${args[1]}§r§c"!`, chatmsg.sender.name, 'Sidebar');
        if(args[1].replace(/[a-zA-Z0-9]/g, '') !== '') return Server.eBroadcast('You cannot use special characters!', chatmsg.sender.name, 'Sidebar');
        if(args[2]) return Server.eBroadcast('No spaces in the tag or sidebar name please!', chatmsg.sender.name, 'Sidebar');
        sc.set(args[1], [args[1]], true);
        return Server.broadcast(`The sidebar §c${args[1]}§7 has been created! You can make it show up on a player's screen by typing "§e/tag "playername" add ${args[1]}§r§7"`, chatmsg.sender.name, 'Sidebar');
    }
    if(preview.includes(args[0])) {
        if(!sc.has(args[1])) return Server.eBroadcast(`Sidebar "§4${args[1]}§r§c" does not exsit!`, chatmsg.sender.name, 'Sidebar');
        let board = Server.sc.get(args[1]).join('§r\n').replace(/\(rank\)/g, getRanks(chatmsg.sender.name) + '§r').replace(/\(name\)/g, getColors(chatmsg.sender.name) + chatmsg.sender.name + '§r');
        if(/(?<=\(score:).+?(?=\))/.test(board)) board.match(/(?<=\(score:).+?(?=\))/g).map((obj: any) => {
            board = board.replace(`(score:${obj})`, Server.player.getScore(obj, chatmsg.sender.name) ? metricNumbers(Server.player.getScore(obj, chatmsg.sender.name)) : 0)
        });
        Server.runCommand(`titleraw "${chatmsg.sender.name}" title {"rawtext":[{"text":${JSON.stringify(board)}}]}`);
        return Server.broadcast(`You are currently previewing the sidebar §c${args[1]}§r§7!`, chatmsg.sender.name, 'Sidebar');
    }
    if(setline.includes(args[0])) {
        if(!sc.has(args[1])) return Server.eBroadcast(`Sidebar "§4${args[1]}§r§c" does not exsit!`, chatmsg.sender.name, 'Sidebar');
        if(!parseInt(args[2])) return Server.eBroadcast('Please type a number', chatmsg.sender.name, 'Sidebar');
        let line = parseInt(args[2]), lineChars = args.slice(3).join(' ');
        if(line > 16) return Server.eBroadcast('You cannt have more than 16 lines sorry :(', chatmsg.sender.name, 'Sidebar');
        if(line < 1) return Server.eBroadcast('There are no lines less than 1 bozo', chatmsg.sender.name, 'Sidebar');
        if(lineChars.includes('\\n')) return Server.eBroadcast(`You cannot go to the next line when you in line §4${line}§c!`, chatmsg.sender.name, 'Sidebar');
        if(line > sc.get(args[1]).length + 1) return Server.eBroadcast(`You haven't made line §4${line - 1}§c yet!`, chatmsg.sender.name, 'Sidebar');
        let board = sc.get(args[1]);
        board.splice(line - 1, 1, lineChars);
        sc.set(args[1], board);
        return Server.broadcast(`Line §c${line}§7 on sidebar "§4${args[1]}§r§7" has been set to "§6${lineChars}§r§7"!`, chatmsg.sender.name, 'Sidebar');
    }
    if(removeline.includes(args[0])) {
        if(!sc.has(args[1])) return Server.eBroadcast(`Sidebar "§4${args[1]}§r§c" does not exsit!`, chatmsg.sender.name, 'Sidebar');
        if(!parseInt(args[2])) return Server.eBroadcast('Please type a number', chatmsg.sender.name, 'Sidebar');
        let line = parseInt(args[2]);
        if(line > 16) return Server.eBroadcast('I bet you don\'t have more than 16 liness', chatmsg.sender.name, 'Sidebar');
        if(line < 1) return Server.eBroadcast('There are no lines less than 1 bozo', chatmsg.sender.name, 'Sidebar');
        if(line > sc.get(args[1]).length + 1) return Server.eBroadcast(`You haven't even made line §4${line - 1}§c yet!`, chatmsg.sender.name, 'Sidebar');
        let board = sc.get(args[1]);
        board.splice(line - 1, 1);
        sc.set(args[1], board);
        return Server.broadcast(`Line §c${line}§7 on sidebar "§4${args[1]}§r§7" has been §4§lremoved§r§7!`, chatmsg.sender.name, 'Sidebar');
    }
    if(settag.includes(args[0])) {
        if(!sc.has(args[1])) return Server.eBroadcast(`Sidebar "§4${args[1]}§r§c" does not exsit!`, chatmsg.sender.name, 'Sidebar');
        if(args[2].replace(/[a-zA-Z0-9]/g, '') !== '') return Server.eBroadcast('You cannot use special characters!', chatmsg.sender.name, 'Sidebar');
        if(args[3]) return Server.eBroadcast('No spaces in the tag or sidebar please!', chatmsg.sender.name, 'Sidebar');
        sc.set(args[2], sc.get(args[1]), true);
        sc.delete(args[1]);
        return Server.broadcast(`The sidebar §c${args[1]}§7 has been renamed to §4${args[2]}§7.`, chatmsg.sender.name, 'Sidebar');
    }
    if(remove.includes(args[0])) {
        if(!sc.has(args[1])) return Server.eBroadcast(`Sidebar "§4${args[1]}§r§c" does not exsit!`, chatmsg.sender.name, 'Sidebar');
        sc.delete(args[1]);
        return Server.broadcast(`The sidebar §c${args[1]}§7 has been §4§lDELETED§r§7!`, chatmsg.sender.name, 'Sidebar');
    }
    if(!args.length||list.includes(args[0])) {
        let allBoards = [];
        for(let key in sc.getCollection()) allBoards.push(`§lTag: §c${key}§r§4`);
        if(allBoards.length > 0) return Server.broadcast(`This server has total of §c${allBoards.length}§7 sidebars(s)! Here's the list of them: \n` + allBoards.join('\n'), chatmsg.sender.name, 'SIDEBAR');
        return Server.eBroadcast('It seems like this server doesn\'t have have any sidebar...', chatmsg.sender.name, 'SIDEBAR');
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'Sidebar');
});