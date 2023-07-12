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
Â© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { system } from '@minecraft/server';
import { ActionForm } from '../../Papers/FormPaper.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
const queue = {};
const cmd = Commands.create({
    name: 'UI',
    description: 'Opens a UI of all the ROT commands so you don\'t have to use chat',
    aliases: ['form', 'frm'],
    category: 'ROT',
    developers: ['Mo9ses']
});
cmd.relayMethod({ form: false });
cmd.callback(plr => {
    Object.assign(queue, { [plr.name]: [plr, 0] });
    plr.send('Close chat open the command UI.');
});
system.runInterval(() => Object.keys(queue).forEach(async (key) => {
    if (queue[key][1] === 0)
        return queue[key][1] = 1;
    const form = await openUI(queue[key][0]);
    console.warn(form);
    if (form || queue[key][1] > 12) {
        console.warn('Done');
        return delete queue[key];
    }
    queue[key][1] = queue[key][1] + 1;
}), 60);
async function openUI(player) {
    let open = true;
    const form = new ActionForm(), cmds = Commands.list.filter(c => c.rM.fM && (c.admin ? player.isAdmin : true));
    form.setTitle('§e§lThe ROT Command UI§r');
    form.setBody('Welcome to the ROT command UI where you can see and use all the commands your have access to.');
    cmds.forEach(c => form.addButton(`§a${c.name[0].toUpperCase()}${c.name.slice(1)}\n§c${c.description.slice(0, 25).trim()}...§r`));
    await form.send(player, res => {
        console.warn(res.cancelationReason);
        if (res?.cancelationReason === 'UserBusy')
            return open = false;
        delete queue[player.name];
        Commands.form(cmds[res.selection], player);
    });
    return open;
}
