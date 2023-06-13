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
import { MS, metricNumbers } from '../../Papers/Paragraphs/ConvertersParagraphs.js';
import { dateReg, nameReg } from '../../Tales/playerConnect.js';
import { addListener } from '../../Tales/main.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Player from '../../Papers/PlayerPaper.js';
const cmd = Commands.create({
    name: 'members',
    description: 'List all of the members that have joined the server before',
    aliases: ['mem', 'players'],
    admin: true,
    category: 'Server',
    developers: ['Mo9ses']
});
cmd.startingArgs('page', false);
cmd.callback((_, args) => !args.length && cmd.force('page', 1));
cmd.numberType('page', (plr, page) => {
    const key = Object.entries(nameReg.getCollection()), len = key.length, memberList = new Array(Math.ceil(key.length / 35)).fill(0).map(_ => key.splice(0, 35)), members = [];
    if (!memberList[page - 1]?.[0])
        return plr.error('Unable to find this page');
    for (const member of memberList[page - 1])
        members.push(`§eMember name: §a${member[0].slice(1)}§e, join date: §a${MS(Date.now() - Number(dateReg.find(member[1]) ?? 0))} ago§e, member ID:§a ${member[1]}`);
    plr.send(`§aCongratulations§e! This server has §c${metricNumbers(len)}§e members! Here is a list of them:\n${members.join('\n')}\n§ePage §a${page}§e/§a${memberList.length}§e. §cPlease remember that the dates are not 100% accurate.`);
});
addListener('playerConnect', plr => Player.send(plr, `Welcome back §c${plr.name}§e!`, 'ROT'));
//Use this for the ban command as well
