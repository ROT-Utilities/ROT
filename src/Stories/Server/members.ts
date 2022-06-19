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
import { metricNumbers } from '../../Papers/paragraphs/ConvertersParagraphs.js';
Server.command.register({
    cancelMessage: true,
    name: 'members',
    description: 'Show all the members who have joined the server before',
    aliases: ['member', 'users', 'players', 'list'],
    category: 'Member Managemeant',
    admin: true,
    documentation: {
        usage: 'members',
        information: 'This command will show you every player that has joined your server ever since ROT has been added.',
        examples: [
            'members'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    try {
        // @ts-ignore
        const page = isNaN(parseInt(args[0])) ? 1 : parseInt(args[0]), allMembers = new Array(Math.ceil(Object.keys(Server.settings.get('members')).length / 30)).fill().map(_ => Object.keys(Server.settings.get('members')).splice(0, 30)), allMembersPage = allMembers[page - 1].map((UUID: string) => {
            return `Memeber name:§6 ${Server.settings.get('members')[UUID][0]}§c, Join date:§6 ${Server.settings.get('members')[UUID][1]}§c, MEMBER UUID:§6 ${UUID}§c,`
        }).join('\n');
        Server.broadcast(`§aCongratulations§7! This server has §c${metricNumbers(Object.keys(Server.settings.get('members')).length)}§7 members! Here is a list of them:\n§c${allMembersPage.slice(0, allMembersPage.length - 1)}.\n§7Page §c${page}§6/§4${allMembers.length}§7!`, chatmsg.sender.name, 'MEMBERS');
    } catch {
        Server.eBroadcast(`Page "§4${args[0]}§r§c" does not exist!`, chatmsg.sender.name, 'MEMBERS');
    }
});