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
import { system } from "@minecraft/server";
import { CommandPaper } from "../../../Papers/CommandPaper/CommandPaper.js";
import { sleep } from "../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { addListener } from "../../../Tales/main.js";
import { DM } from "../main.js";
import Player from "../../../Papers/PlayerPaper.js";
import quick from "../../../quick.js";
let loaded = [];
system.runInterval(() => {
    if (system.currentTick < 20)
        return;
    const keys = DM.cmd.reg.allKeys();
    if (JSON.stringify(keys) === JSON.stringify(loaded))
        return;
    loaded = keys;
    load();
}, 20);
async function load() {
    await sleep(20);
    const handles = {};
    for (const cmd of DM.cmd.reg.allKeys()) {
        if (!handles.hasOwnProperty(cmd[0]))
            handles[cmd[0]] = {};
        const parts = cmd.slice(1).split(' '), FN = DM.cmd.base.find(DM.cmd.reg.read(cmd))?.split('&-&')?.[1];
        if (!handles[cmd[0]].hasOwnProperty(parts[0]))
            handles[cmd[0]][parts[0]] = [[], []];
        if (parts.length === 1)
            handles[cmd[0]][parts[0]][0] = JSON.parse(DM.cmd.regData.find(DM.cmd.reg.read(cmd)).replace(/\$-\$/g, '"'));
        handles[cmd[0]][parts[0]][1].push([parts[1], FN]);
    }
    Object.entries(handles).forEach(p => {
        const handle = new CommandPaper(p[0]);
        handle.list = [];
        addListener('beforeChat', data => {
            if (!data.message.startsWith(p[0]))
                return;
            const args = data.message.slice(1).trim().split(/\s+/), command = args.shift(), cmd = handle.list.find(cmd => cmd.name === command);
            handle.run(cmd, Player.playerType(data.player, { from: cmd?.name ?? 'ROT' }), args);
            throw new Error();
        });
        Object.entries(p[1]).forEach((c) => {
            const order = c[1][1].sort((a, b) => a[0]?.length ?? 0 - b[0]?.length ?? 0), based = !Boolean(order[0][0]?.length);
            const cmd = handle.create({
                name: c[0],
                description: c[1][0][0],
                category: c[1][0][1],
                developers: ['Mo9ses', c[1][0][2]]
            });
            cmd.startingArgs(order.map(a => a[0]).slice(Number(based)), !based);
            if (based)
                cmd.callback((plr, args) => !args.length && (order?.[0]?.[1]?.split(';') ?? []).forEach(cm => { try {
                    Player.asyncCommandPaper(plr, cm);
                }
                catch { } ; }));
            order.slice(Number(based)).forEach(a => cmd.dynamicType(a[0], a[0], plr => a[1]?.split(';')?.forEach(cm => { try {
                Player.asyncCommandPaper(plr, cm);
            }
            catch { } ; })));
        });
        helpCommand(handle);
    });
}
function helpCommand(handle) {
    const cmd = handle.create({
        name: 'help',
        description: 'This is the defualt help command for ROT\'s Director Mode.',
        category: 'Director',
    });
    cmd.startingArgs(['page'], false);
    cmd.callback((plr, args) => !args.length && cmd.force(plr, 'page', 1));
    cmd.numberType('page', (plr, page) => {
        const commandList = new Array(Math.ceil(handle.list.length / 35)).fill(0).map(_ => handle.list.filter(c => plr.isAdmin ? true : !c.admin || (c.tags?.length ? plr.isAdmin : false)).splice(0, 35)), help = [], categoryHold = [];
        if (!commandList[page - 1]?.[0])
            return plr.error('Unable to find this page');
        for (const command of commandList[page - 1]) {
            if (!categoryHold.includes(command.category))
                help.push(`\n   §6<=-=-=-§e${command.category.toUpperCase()}§6=-=-=->\n`) && categoryHold.push(command.category);
            help.push(`§e${command.name[0].toUpperCase() + command.name.slice(1)}§6 - §6${command.description}`);
        }
        plr.tip(`Join the discord if you need any more help!§l§d ${quick.YourDiscord}`);
        plr.sendMessage(`§l${help.join('\n')}\n   §a§l<=-=-=-=-=-=-=-=-=->\n§6Page:§r §e${page}§a/§e${commandList.length}\nUse "§6${handle.prefix}help §a<Page Number>§e" To see the next page`);
    }, [], { min: 0 });
}
