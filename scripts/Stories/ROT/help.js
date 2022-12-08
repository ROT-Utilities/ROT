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
import Server from '../../ServerBook.js';
import Lang from '../../Papers/LangPaper.js';
import quick from '../../main.js';
const cmd = Server.command.create({
    name: 'help',
    description: 'Get list of all the commands available or input a command name to get information about that specific command',
    aliases: ['?'],
    category: 'ROT',
    developers: ['Mo9ses']
});
cmd.startingArgs(['cmd', 'page'], false);
cmd.callback((plr, args) => !args.length && cmd.force('page', 1));
cmd.dynamicType('cmd', [Server.command.list.map(c => c.name), Server.command.list.map(c => c.aliases)].flat(2), (plr, val) => {
    const cmd = Server.command.list.find(c => c.name === val || c.aliases.includes(val));
    if (cmd && cmd.admin && !plr.isAdmin)
        plr.send(Lang.cmd.noPerms);
    let hI = `§l§1Command: §a${quick.prefix}§a${cmd.name}\n`;
    if (cmd.description.length)
        hI += `§1Description:§r§3 ${cmd.description}\n`;
    if (cmd.aliases.length)
        hI += `§l§1Aliases:§r§3 ${cmd.aliases.join(`§1, §3`)}\n`;
    hI += `§l§1Category:§3 ${cmd.category.toUpperCase()}\n`;
    if (cmd.toggle)
        hI += `§1Togglable:§3 ${cmd.toggle}\n`;
    if (cmd.tags)
        hI += `§1Tags(s):§3 ${cmd.tags.join('§1, §3')}`;
    if (cmd.developers)
        hI += `§1Developer(s):§3 ${cmd.developers.join('§1, §3')}`;
    if (cmd.notes)
        hI += `§1Notes:§3 ${cmd.notes}\n`;
    plr.tip(`Join the ROT Discord if you need any more help!§l§d ${quick.discord}`, 'ROT');
    plr.tell(`§3${hI}`);
});
cmd.numberType('page', (plr, page) => {
    plr.tip(`Join the ROT Discord if you need any more help!§l§d ${quick.discord}`);
    const commandList = new Array(Math.ceil(Server.command.list.length / 35)).fill(0).map(_ => Server.command.list.filter(c => plr.isAdmin ? true : !c.admin || (c.tags?.length ? plr.hasTags(c.tags) : false)).splice(0, 35)), help = [], categoryHold = [];
    for (const command of commandList[page - 1]) {
        if (!categoryHold.includes(command.category))
            help.push(`\n   §3<=-=-=-§b${command.category.toUpperCase()}§3=-=-=->\n`) && categoryHold.push(command.category);
        help.push(`§1${command.name}§3 - §3${command.description}`);
    }
    plr.tell(`§l${help.join('\n')}\n   §a§l<=-=-=-=-=-=-=-=-=->\n§3Page:§r §1${page}§a/§1${commandList.length}\nUse "§3${quick.prefix}help §a<Page Number>" §1To see the next page`);
}, '', { min: 0 });
