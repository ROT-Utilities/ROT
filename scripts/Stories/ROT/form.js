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
Â© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
/**
import { world } from '@minecraft/server';
import config from '../../main.js';
import { commands } from '../../Papers/CommandPaper/CommandPaper.js';
import { ActionForm } from '../../Papers/FormPaper.js';
import { setTickInterval } from '../../Papers/paragraphs/ExtrasParagraphs.js';
import { PaperPlayer } from '../../Papers/PlayerPaper.js';
import Server from '../../ServerBook.js';
const frm: { [key: string]: number } = {};
const cmd = Server.command.create({
    name: 'UI',
    description: 'Opens a UI of all the ROT commands so you don\'t have to use chat',
    aliases: ['form', 'frm'],
    category: 'ROT',
    developers: ['Mo9ses']
});
cmd.relayMethod({ form: false });
cmd.callback(plr => {
    Object.assign(frm, { [plr.nameTag]: 0 });
    plr.send('Please move around to open the command UI.');
});
setTickInterval(() => {
    const keys = Object.keys(frm);
    if(!keys.length) return;
    for(const player of world.getPlayers()) if(Math.sqrt(player.velocity.x ** 2 + player.velocity.z ** 2) > 0.1 && keys.includes(player.nameTag)) {
        const list = new ActionForm(), plr = PaperPlayer(player), cmds = commands.filter(c => c.rM.fM && (c.admin ? plr.hasTag(config.adminTag) : true));
        list.setTitle('§e§lThe ROT Command UI');
        list.setBody('Welcome to the ROT command UI where you can see and use all the commands your have access to.');
        cmds.forEach(c => list.addButton(`§a${c.name[0].toUpperCase()}${c.name.slice(1)}\n§c${c.description.slice(0, 25).trim()}...`));
        delete frm[plr.nameTag];
        list.send(plr, res => !res.canceled && Server.command.form(cmds[res.selection], plr));
    };
}, 1);
world.events.playerLeave.subscribe(plr => delete frm[plr.playerName]);
*/
//disabled
