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
import { ID, confirmForm } from "../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { ActionForm, ModalForm } from "../../../Papers/FormPaper.js";
import { creations } from "../creations.js";
import { DM } from "../main.js";
//Creating a command
export function create(player) {
    const form = new ModalForm();
    form.setTitle('§a§lCreation');
    form.addDropdown('Choose a prefix', DM.config.prefixes, 0);
    form.addInput('Name', 'ping');
    form.addInput('Description', 'Nothing but pingggg');
    form.addInput('Category', 'Test');
    form.addInput('Base command (optional)', 'say pong');
    form.send(player, async (res) => {
        if (res.canceled)
            return DM.open(player);
        for (let i = 1; i < 4; i++)
            if (!res.formValues[i])
                return player.error('Please complete the form.');
        const cmd = `${DM.config.prefixes[res.formValues[0]]}${res.formValues[1]}`, id = Number(ID());
        if (DM.cmd.reg.has(cmd) || DM.cmd.reg.has(JSON.stringify([res.formValues[2], res.formValues[3], player.name]).replace(/"/g, '$-$')))
            return player.error('There is already a command with this prefix, name, or description. You can either change this one, or change the other one.');
        DM.cmd.reg.write(cmd, id);
        DM.cmd.regData.write(JSON.stringify([res.formValues[2], res.formValues[3], player.name]).replace(/"/g, '$-$'), id);
        if (res.formValues[4])
            DM.cmd.base.write(`${id}&-&${res.formValues[4]}`, id);
        (await confirmForm(player, '§a§lSuccess!', `The custom command "§e${cmd}§r" has been created. Do you want to create a new one?`)) ? create(player) : player.send('Goodbye!');
    });
}
//Configure a command
export async function findCommand(player) {
    let cmd;
    const cmds = Object.entries(DM.cmd.reg.getCollection()).filter((c) => c[0].split(' ').length === 1);
    if (!cmds.length) {
        await confirmForm(player, '§c§lNone?', 'This server doesn\'t have any custom commands. Would you like to make one?') ? create(player) : DM.open(player);
        return true;
    }
    const form = new ActionForm();
    form.setTitle('§a§lFind your command');
    form.setBody('§c§oIf you can\'t find a custom command you just created, please come back later. It may take a few seconds for it to register.');
    cmds.forEach(c => form.addButton(`§e${c[0][0]}§a${c[0].slice(1)}`, 'textures/ROT/forms/Director Mode/ultra.png'));
    form.addButton('§4§lCancel', 'textures/ROT/forms/Director Mode/quit.png');
    await form.send(player, res => {
        if (res.canceled)
            return player.send('Goodbye!');
        if (res.selection === cmds.length)
            return;
        const data = JSON.parse(DM.cmd.regData.find(cmds[res.selection][1]).replace(/\$-\$/g, '"'));
        cmd = {
            id: cmds[res.selection][1],
            prefix: cmds[res.selection][0][0],
            name: cmds[res.selection][0].slice(1),
            description: data[0],
            category: data[1],
            base: DM.cmd.base.find(cmds[res.selection][1])?.split('&-&')?.[1] ?? '§cNo command',
            creator: data[2],
            arguments: []
        };
    });
    return cmd;
}
export function configure(player, cmd) {
    const form = new ActionForm();
    form.setTitle('§e§lConfiguration');
    form.setBody(`Command: §e${cmd.prefix}§a${cmd.name}\n§rDescription: §a${cmd.description}\n§rBase command: §a${cmd.base}\n§rCategory: §a${cmd.category}\n§rCreator: §a${cmd.creator}§r, and §6Mo9ses\n`);
    form.addButton('§aAdd a argument\n§e(not finished)', 'textures/ROT/forms/Director Mode/new.png');
    form.addButton('§eEdit base command', 'textures/ROT/forms/Director Mode/change2.png');
    form.addButton('§cDelete command', 'textures/ROT/forms/Director Mode/garbage.png');
    form.addButton('§4§lBack', 'textures/ROT/forms/Director Mode/leave.png');
    form.send(player, async (res) => {
        if (res.canceled)
            return player.send('Goodbye!');
        if (res.selection === 3)
            return DM.open(player);
        if (res.selection === 1)
            return editCommand(player, cmd);
        if (res.selection === 2) {
            if (!(await confirmForm(player, '§c§lAre you sure?', `§cAre you sure you want to delete the "§e${cmd.prefix}§a${cmd.name}§c" command?`)))
                return configure(player, cmd);
            DM.cmd.reg.deleteMany(DM.cmd.reg.findMany(Number(cmd.id)));
            DM.cmd.regData.deleteMany(DM.cmd.regData.findMany(Number(cmd.id)));
            DM.cmd.base.deleteMany(DM.cmd.base.findMany(Number(cmd.id)));
        }
    });
}
function editCommand(player, cmd) {
    const form = new ModalForm();
    form.setTitle(`§e§lEdit ${cmd.name}`);
    form.addDropdown('Choose a prefix', DM.config.prefixes, DM.config.prefixes.findIndex(c => c === cmd.prefix));
    form.addInput('Name', cmd.name, cmd.name);
    form.addInput('Description', cmd.description, cmd.description);
    form.addInput('Category', cmd.category, cmd.category);
    form.addInput('Base command (optional)', cmd.base, cmd.base === '§cNo command' ? '' : cmd.base);
    form.send(player, async (res) => {
        if (res.canceled)
            return DM.open(player);
        for (let i = 0; i < 4; i++)
            if (!res.formValues[i])
                return player.error('Please complete the form.');
        DM.cmd.reg.delete(`${cmd.prefix}${cmd.name}`);
        DM.cmd.regData.delete(JSON.stringify([cmd.description, cmd.category, cmd.creator]).replace(/"/g, '$-$'));
        DM.cmd.base.delete(`${cmd.id}&-&${cmd.base}`);
        const name = `${DM.config.prefixes[res.formValues[0]]}${res.formValues[1]}`;
        DM.cmd.reg.write(name, cmd.id);
        DM.cmd.regData.write(JSON.stringify([res.formValues[2], res.formValues[3], player.name]).replace(/"/g, '$-$'), cmd.id);
        if (res.formValues[4]?.length)
            DM.cmd.base.write(`${cmd.id}&-&${res.formValues[4]}`, cmd.id);
        else
            DM.cmd.base.delete(`${cmd.id}&-&${cmd.base}`);
        (await confirmForm(player, '§a§lSuccess!', `The custom command "§e${name}§r" has been updated. Do you want to update something else?`)) ? creations(player) : player.send('Goodbye!');
    });
}
import "./load.js";
