/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { system, world } from '@minecraft/server';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import { metricNumbers } from '../../Papers/Paragraphs/ConvertersParagraphs.js';
import Player from '../../Papers/PlayerPaper.js';
import Server from '../../Papers/ServerPaper.js';
const cmd = Commands.create({
    name: 'scoreboard',
    description: 'Make a personal custom sidebar for players!',
    aliases: ['score', 'board', 'scoreboard', 'sidebar', 'personal-sidebar', 'sb'],
    category: 'Server',
    admin: true,
    developers: ['Aex66']
});
let sc = null;
(async function () {
    sc = await Database.register('SC');
})();
cmd.unknownType('any', null, 1);
cmd.numberType('anynumber', null);
cmd.unknownType('anynull', null);
cmd.startingArgs(['create', 'remove', 'preview', 'setline', 'removeline', 'settag', 'list'], false);
cmd.callback((plr, args) => {
    if (args.length)
        return;
    cmd.force(plr, 'list', null);
});
cmd.staticType('create', 'create', (plr, val) => {
    if (sc.has(val))
        return plr.error(`This server already has the sidebar "§6${val}§r§e"!`, 'Sidebar');
    if (val.replace(/[a-zA-Z0-9]/g, '') !== '')
        return plr.error('You cannot use special characters!', 'Sidebar');
    sc.write(val, [val]);
    return plr.send(`The sidebar §6${val}§e has been created! You can make it show up on a player's screen by typing "§6/tag "playername" add ${val}§r§e"`, 'Sidebar');
});
cmd.staticType('remove', 'remove', (plr, val) => {
    if (!sc.has(val))
        return plr.error(`Sidebar "§6${val}§r§e" does not exsit!`, 'Sidebar');
    sc.delete(val);
    return plr.send(`The sidebar §6${val}§e has been §6§lDELETED§r§e!`, 'Sidebar');
});
cmd.dynamicType('preview', ['show', 'preview', 'pushingp'], (plr, _, args) => {
    if (!sc.has(args[0]))
        return plr.error(`Sidebar "§6${args[0]}§r§e" does not exsit!`, 'Sidebar');
    let board = sc.read(args[0]).join('§r\n').replace(/\(rank\)/g, plr.getPrefixes().join('§r§7, ') + '§r').replace(/\(name\)/g, plr.getNameColor() + '§r');
    if (/(?<=\(score:).+?(?=\))/.test(board))
        board.match(/(?<=\(score:).+?(?=\))/g).map((obj) => {
            board = board.replace(`(score:${obj})`, plr.getScore(obj) ? metricNumbers(plr.getScore(obj)) : 0);
        });
    if (/(?<=\(tag:).+?(?=\))/.test(board))
        board.match(/(?<=\(tag:).+?(?=\))/g).map((tag) => {
            board = board.replace(`(tag:${tag})`, Array.from(world.getPlayers()).filter(p => p.hasTag(tag)).map(p => p?.name)?.length ?
                Array.from(world.getPlayers()).filter(p => p.hasTag(tag)).map(p => p?.name).join('§r§7, ') :
                '');
        });
    Server.runCommand(`titleraw "${plr.name}" actionbar {"rawtext":[{"text":${JSON.stringify(board)}}]}`);
    return plr.send(`You are currently previewing the sidebar §6${args[0]}§r§e!`, 'Sidebar');
}, 'any');
cmd.dynamicType('setline', ['setline', 'addline', 'newline', 'sl'], (plr, _, args) => {
    if (!sc.has(args[0]))
        return plr.error(`Sidebar "§6${args[0]}§r§e" does not exsit!`, 'Sidebar');
    if (!args[1])
        return plr.error('Please type a number', 'Sidebar');
    let line = args[1], lineChars = args[2].join(' ');
    if (line > 16)
        return plr.error('You cannt have more than 16 lines sorry :(', 'Sidebar');
    if (line < 1)
        return plr.error('There are no lines less than 1 bozo', 'Sidebar');
    if (lineChars.includes('\\n'))
        return plr.error(`You cannot go to the next line when you in line §6${line}§e!`, 'Sidebar');
    if (line > sc.read(args[0]).length + 1)
        return plr.error(`You haven't made line §6${line - 1}§e yet!`, 'Sidebar');
    let board = sc.read(args[0]);
    board.splice(line - 1, 1, lineChars);
    sc.write(args[0], board);
    return plr.send(`Line §6${line}§e on sidebar "§6${args[0]}§r§e" has been set to "§6${lineChars}§r§e"!`, 'Sidebar');
}, 'sl:sidebar');
cmd.numberType('sl:line', null, 'anynull');
cmd.unknownType('sl:sidebar', null, 1, false, 'sl:line');
cmd.dynamicType('removeline', ['delline', 'd', 'removeline'], (plr, _, args) => {
    if (!sc.has(args[0]))
        return plr.error(`Sidebar "§6${args[0]}§r§e" does not exsit!`, 'Sidebar');
    if (!args[1])
        return plr.error('Please type a number', 'Sidebar');
    let line = args[1];
    if (line > 16)
        return plr.error('I bet you don\'t have more than 16 liness', 'Sidebar');
    if (line < 1)
        return plr.error('There are no lines less than 1 bozo', 'Sidebar');
    if (line > sc.read(args[0]).length + 1)
        return plr.error(`You haven't even made line §6${line - 1}§e yet!`, 'Sidebar');
    let board = sc.read(args[0]);
    board.splice(line - 1, 1);
    sc.write(args[0], board);
    return plr.send(`Line §6${line}§e on sidebar "§6${args[0]}§r§e" has been §6§lremoved§r§e!`, 'Sidebar');
}, 'rl:sidebar');
cmd.numberType('rl:line', null);
cmd.unknownType('rl:sidebar', null, 1, false, 'rl:line');
cmd.dynamicType('settag', ['st', 'settag', 'maketag'], (plr, _, args) => {
    if (!sc.has(args[0]))
        return plr.error(`Sidebar "§6${args[0]}§r§e" does not exsit!`, 'Sidebar');
    if (args[1].replace(/[a-zA-Z0-9]/g, '') !== '')
        return plr.error('You cannot use special characters!', 'Sidebar');
    sc.write(args[1], sc.read(args[0]));
    sc.delete(args[0]);
    return plr.send(`The sidebar §6${args[0]}§e has been renamed to §6${args[1]}§e.`, 'Sidebar');
}, 'st:any');
cmd.unknownType('st:any', null, 1, false, 'st:tag');
cmd.unknownType('st:tag', null, 1);
cmd.staticType('list', 'list', (plr) => {
    let allBoards = [];
    for (let key in sc.getCollection())
        allBoards.push(`§lTag: §6${key}§r§6`);
    if (allBoards.length > 0)
        return plr.send(`This server has total of §6${allBoards.length}§e sidebars(s)! Here's the list of them: \n` + allBoards.join('\n'), 'SIDEBAR');
    return plr.error('It seems like this server doesn\'t have have any sidebar...', 'SIDEBAR');
}, null, false);
system.runInterval(() => {
    if (!sc)
        return;
    world.getAllPlayers().forEach((p) => {
        const tags = p?.getTags();
        if (!tags?.length)
            return;
        tags.forEach((tag) => {
            if (sc.has(tag)) {
                let board = sc.read(tag).join('§r\n').replace(/\(rank\)/g, Player.getPrefixes(p).join('§r§7, ') + '§r').replace(/\(name\)/g, Player.getNameColor(p) + '§r');
                if (/(?<=\(score:).+?(?=\))/.test(board))
                    board.match(/(?<=\(score:).+?(?=\))/g).map((obj) => board = board.replace(`(score:${obj})`, Player.getScore(p, obj) ? metricNumbers(Player.getScore(p, obj)) : 0));
                if (/(?<=\(tag:).+?(?=\))/.test(board))
                    board.match(/(?<=\(tag:).+?(?=\))/g).map((tag) => board = board.replace(`(tag:${tag})`, Array.from(world.getPlayers()).filter(p => p.hasTag(tag)).map(p => p?.name)?.length ? Array.from(world.getPlayers()).filter(p => p.hasTag(tag)).map(p => p?.name).join('§r§7, ') : ''));
                Server.runCommand(`titleraw "${p.name}" title {"rawtext":[{"text":${JSON.stringify(board)}}]}`);
            }
        });
    });
}, 1);
