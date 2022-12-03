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
© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import quick, { DatabasePaper } from '../../Papers/DatabasePaper.js';
import { metricNumbers } from '../../Papers/paragraphs/ConvertersParagraphs.js';
import Server from '../../ServerBook.js';
const cmd = Server.command.create({
    name: 'members',
    description: `When you type ${quick.prefix}close in chat, time will end!`,
    aliases: ['end', 'over', 'norot', 'badrot', 'rotisgay', 'gay', 'reload', 'reboot', 'restart', 'shutdown'],
    admin: true,
    category: 'Server',
    developers: ['Aex66']
});
const members = new DatabasePaper('members');
cmd.startingArgs('page');
cmd.numberType('page', (plr, page) => {
    try {
        //@ts-ignore
        const allMembers = new Array(Math.ceil(members.allKeys().length / 30)).fill().map(() => members.allKeys().splice(0, 30)), allMembersPage = allMembers[page - 1].map(id => {
            return `Member name:§6 ${members.read(id).playerName}§c, Join date:§6 ${new Date(members.read(id).joinDate).toString()}§c, MEMBER ID:§6 ${id}§c,`;
        }).join('\n');
        plr.send(`§aCongratulations§7! This server has §c${metricNumbers(members.read('memberCount'))}§7 members! Here is a list of them:\n§c${allMembersPage.slice(0, allMembersPage.length - 1)}.\n§7Page §c${page}§6/§4${allMembers.length}§7!`);
    }
    catch (_a) {
        plr.error(`Page "§4${page}§r§c" does not exist!`);
    }
});
