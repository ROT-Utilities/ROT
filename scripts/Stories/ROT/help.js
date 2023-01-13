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
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Lang from '../../Papers/LangPaper.js';
import quick from '../../main.js';
const cmd = Commands.create({
    name: 'help',
    description: 'Get list of all the commands available or input a command name to get information about that specific command',
    aliases: ['?'],
    category: 'ROT',
    developers: ['Mo9ses']
});
cmd.startingArgs(['cmd', 'page'], false);
cmd.callback((_, args) => !args.length && cmd.force('page', 1));
cmd.dynamicType('cmd', [Commands.list.map(c => c.name), Commands.list.map(c => c.aliases)].flat(2), (plr, val) => {
    const cmd = Commands.list.find(c => c.name === val || c.aliases.includes(val));
    if (cmd && cmd.admin && !plr.isAdmin)
        plr.send(Lang.cmd.noPerms);
    let hI = `§l§eCommand: §a${quick.prefix}§a${cmd.name}\n`;
    if (cmd.description.length)
        hI += `§eDescription:§r§6 ${cmd.description}\n`;
    if (cmd.aliases.length)
        hI += `§l§eAliases:§r§3 ${cmd.aliases.join(`§e, §6`)}\n`;
    hI += `§l§eCategory:§3 ${cmd.category.toUpperCase()}\n`;
    if (cmd.toggle)
        hI += `§eTogglable:§3 ${cmd.toggle}\n`;
    if (cmd.tags)
        hI += `§eTags(s):§3 ${cmd.tags.join('§e, §6')}`;
    if (cmd.developers)
        hI += `§eDeveloper(s):§6 ${cmd.developers.join('§e, §6')}`;
    if (cmd.notes)
        hI += `§eNotes:§6 ${cmd.notes}\n§r`;
    plr.tip(`Join the ROT Discord if you need any more help!§l§d ${quick.discord}`, 'ROT');
    plr.tell(`§6${hI}§r`);
});
cmd.numberType('page', (plr, page) => {
    plr.tip(`Join the ROT Discord if you need any more help!§l§d ${quick.discord}`); //§r
    const commandList = new Array(Math.ceil(Commands.list.length / 35)).fill(0).map(_ => Commands.list.filter(c => plr.isAdmin ? true : !c.admin || (c.tags?.length ? plr.isAdmin : false)).splice(0, 35)), help = [], categoryHold = [];
    for (const command of commandList[page - 1]) {
        if (!categoryHold.includes(command.category))
            help.push(`\n   §6<=-=-=-§e${command.category.toUpperCase()}§6=-=-=->\n`) && categoryHold.push(command.category);
        help.push(`§e${command.name}§6 - §6${command.description}`); //§r
    }
    plr.tell(`§l${help.join('\n')}\n   §a§l<=-=-=-=-=-=-=-=-=->\n§6Page:§r §e${page}§a/§e${commandList.length}\nUse "§6${quick.prefix}help §a<Page Number>§e" To see the next page`);
}, '', { min: 0 });
