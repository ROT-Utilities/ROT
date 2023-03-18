import { ActionForm } from '../../Papers/FormPaper.js';
import { setTickInterval } from '../../Papers/paragraphs/ExtrasParagraphs.js';
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
setTickInterval(() => Object.keys(queue).forEach(async (key) => {
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
        if (res?.cancelationReason === 'userBusy')
            return open = false;
        delete queue[player.name];
        Commands.form(cmds[res.selection], player);
    });
    return open;
}
