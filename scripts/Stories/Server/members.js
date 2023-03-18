import Commands from '../../Papers/CommandPaper/CommandPaper.js';
const cmd = Commands.create({
    name: 'members',
    description: 'List all of the members that have joined the server before',
    aliases: ['mem', 'players'],
    admin: true,
    category: 'Server',
    developers: ['Mo9ses']
});
cmd.numberType('page', (plr, page) => {
    // try {
    //     //@ts-ignore
    //     const allMembers = new Array(Math.ceil(members.allKeys().length / 30)).fill().map(() => members.allKeys().splice(0, 30)), allMembersPage = allMembers[page - 1].map(id => {
    //         return `Member name:§6 ${members.read(id).playerName}§c, Join date:§6 ${new Date(members.read(id).joinDate).toString()}§c, MEMBER ID:§6 ${id}§c,`;
    //     }).join('\n')
    //     plr.send(`§aCongratulations§7! This server has §c${metricNumbers(members.read('memberCount'))}§7 members! Here is a list of them:\n§c${allMembersPage.slice(0, allMembersPage.length - 1)}.\n§7Page §c${page}§6/§4${allMembers.length}§7!`)
    // } catch {
    //    plr.error(`Page "§4${page}§r§c" does not exist!`);
    // }
});
