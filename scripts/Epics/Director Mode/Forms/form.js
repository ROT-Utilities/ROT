import { ID, confirmForm, sleep } from "../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { ActionForm, ModalForm } from "../../../Papers/FormPaper.js";
import { creations } from "../creations.js";
import { DM } from "../main.js";
//Creating a form
export function create(player) {
    const form = new ModalForm();
    form.setTitle('§a§lGUI Creation');
    form.addInput('Title:', 'Teleport');
    form.addInput('Body (optional)', 'Where do you want to go?');
    form.addInput('Tag (optional)', 'hi');
    form.addInput('Item (optional)', 'minecraft:stick');
    form.addInput('Base command (optional)', 'say I opened a GUI');
    form.addDropdown('Form tye:', ['Button Form §o(only buttons)', 'Confirm Form §o(Yes or No button)', '§4Input Form §o(Sliders & Text boxes)§r§4§l (Beta)'], 0);
    form.send(player, res => {
        if (res.canceled)
            return DM.open(player);
        if (!res.formValues[0]?.length)
            return player.error('Please complete the form.');
        if (DM.form.forms.hasOwnProperty(res.formValues[0]))
            return player.error('There is already a form with this name. You can either remove it, or configure it.');
        const id = Number(ID());
        DM.form.reg.write(`${id}&-&${JSON.stringify([res.formValues[0], res.formValues[1], res.formValues[2], res.formValues[3], res.formValues[4], res.formValues[5], player.name]).replace(/"/g, '$-$')}`, id);
        DM.form.regBTNs.write(`${id}&-&${JSON.stringify({ 0: ['§cClose', 'textures/ROT/forms/Director Mode/leave.png', '', 0] }).replace(/"/g, '$-$')}`, id);
        creations(player);
    });
}
export async function findForm(player) {
    let Form;
    const forms = Object.keys(DM.form.forms);
    if (!forms.length) {
        await confirmForm(player, '§c§lNone?', 'This server doesn\'t have any forms. Would you like to make one?') ? create(player) : DM.open(player);
        return true;
    }
    const form = new ActionForm();
    form.setTitle('§a§lFind your form/GUI');
    form.setBody('§c§oIf you can\'t find a form you just created, please come back later. It may take a few seconds for it to register.');
    forms.forEach(f => form.addButton(`§nTitle: §a${DM.form.forms[f].name}\n§nBody: §2${DM.form.forms[f].body.slice(0, 9)}${DM.form.forms[f].body.length > 9 ? '...' : ''}`, 'textures/ROT/forms/Director Mode/ui.png'));
    form.addButton('§4§lCancel', 'textures/ROT/forms/Director Mode/quit.png');
    await form.send(player, res => {
        if (res.canceled)
            return player.send('Goodbye!');
        if (res.selection === forms.length)
            return;
        Form = DM.form.forms[forms[res.selection]];
    });
    return Form;
}
export function configure(player, Form) {
    const form = new ActionForm();
    form.setTitle('§e§lConfiguration');
    form.setBody([
        `Form Title: §a${Form.name}`,
        `§rBody: §a${Form.body}`,
        `§rType: §a${['Button Form §o(only buttons)', 'Confirm Form §o(Yes or No button)', 'Input Form §o(Toggles & Text boxes)'][Form.type]}`,
        `§rBase command: §a${Form.base?.length ? Form.base : '§cN/A'}`,
        `§rTag: §a${Form.tag}`,
        `§rItem: §a${Form.item}`,
        `§rCreator: §a${Form.creator}§r, and §6Mo9ses\n`
    ].join('\n'));
    form.addButton('§aForm settings', 'textures/ROT/forms/Director Mode/change2.png');
    form.addButton('§2Form properties', 'textures/ROT/forms/Director Mode/change.png');
    form.addButton('§eDelete form', 'textures/ROT/forms/Director Mode/garbage.png');
    form.addButton('§c§lBack', 'textures/ROT/forms/Director Mode/leave.png');
    form.send(player, async (res) => {
        if (res.canceled || res.selection === 3)
            return DM.open(player);
        if (res.selection === 0)
            return editForm(player, Form);
        if (res.selection === 1)
            return editButtons(player, Form);
        if (res.selection === 2) {
            if (!(await confirmForm(player, '§c§lAre you sure?', `§cAre you sure you want to delete the "§a${Form.name}§r§c" form?`)))
                return configure(player, Form);
            DM.form.reg.deleteMany(DM.form.reg.findMany(Number(Form.id)));
            DM.form.regBTNs.deleteMany(DM.form.regBTNs.findMany(Number(Form.id)));
        }
    });
}
function editForm(player, Form) {
    const form = new ModalForm();
    form.setTitle(`§e§lEdit ${Form.name}`);
    form.addInput('Title', Form.name, Form.name);
    form.addInput('Body', Form.body, Form.body);
    form.addInput('Tag', Form.tag, Form.tag);
    form.addInput('Item', Form.item, Form.item);
    form.addInput('Base command (optional)', Form.base, Form.base);
    form.send(player, async (res) => {
        if (res.canceled) {
            const f = await findForm(player);
            if (!f)
                return creations(player);
            if (f === true)
                return;
            return configure(player, f);
        }
        if (!res.formValues[0]?.length)
            return player.error('Please complete the form.');
        if (DM.form.forms.hasOwnProperty(res.formValues[0]))
            return player.error('There is already a form with this name. You can either remove it, or configure it.');
        DM.form.reg.deleteMany(DM.form.reg.findMany(Number(Form.id)));
        sleep(5);
        DM.form.reg.write(`${Form.id}&-&${JSON.stringify([res.formValues[0], res.formValues[1], res.formValues[2], res.formValues[3], res.formValues[4], Form.type, player.name]).replace(/"/g, '$-$')}`, Number(Form.id));
        if (await confirmForm(player, '§a§lSuccess!', `The form "§e${res.formValues[0]}§r" has been updated. Do you want to update something else?`)) {
            const f = await findForm(player);
            if (!f)
                return creations(player);
            if (f === true)
                return;
            return configure(player, f);
        }
        else
            player.send('Goodbye!');
    });
}
function editButtons(player, Form) {
    const buttons = Object.entries(Form.buttons), form = new ActionForm();
    form.setTitle('§a§lEditing form properties');
    form.setBody([
        `Form Title: §a${Form.name}`,
        `§rBody: §a${Form.body}`,
        `§rAmount of Properties (buttons): §a${buttons?.length}`,
    ].join('\n'));
    buttons.forEach(b => form.addButton(`§7Name:§r ${b[1][0]}§r\n§7CMD:§r §c${b[1][2].slice(0, 9)}${b[1][2].length ? b[1][2].length > 9 ? '...' : '' : 'N/A'}`, !Form.type && b[1][1] ? b[1][1] : undefined));
    if (Form.type === 1 ? 2 > buttons.length : true)
        form.addButton(`§aAdd new property`, 'textures/ROT/forms/Director Mode/new.png');
    if (buttons.length > 1)
        form.addButton('§cRemove property', 'textures/ROT/forms/Director Mode/garbage.png');
    form.send(player, res => {
        if (res.canceled)
            return configure(player, Form);
        if (buttons.length ? res.selection < buttons.length : true)
            return editButton(player, Form, res.selection, false);
        if (buttons.length === 1 ? true : res.selection === buttons.length)
            return editButton(player, Form, res.selection, true);
        removeButton(player, Form);
    });
}
function editButton(player, Form, index, add) {
    const button = (add ? [index, ['New property', 'textures/ROT/forms/Director Mode/dev.png', '', 0]] : Object.entries(Form.buttons)[index]), form = new ModalForm();
    form.setTitle(`§a§l${add ? 'Add a new' : 'Editing a'} Property`);
    form.addInput('Property name:', button[1][0], button[1][0]);
    form.addInput('Command:', button[1][2].length ? button[1][2] : 'N/A', button[1][2]);
    form.addInput('Icon (Only for Button Form):', button[1][1], button[1][1]);
    form.addDropdown('Type (Only for Input Form):', ['Text box', 'Switch'], button[1][3]);
    form.send(player, async (res) => {
        if (res.canceled)
            return editButtons(player, Form);
        DM.form.regBTNs.deleteMany(DM.form.regBTNs.findMany(Number(Form.id)));
        await sleep(10);
        Form.buttons[index] = [res.formValues[0], res.formValues[2], res.formValues[1], Number(res.formValues[3])];
        DM.form.regBTNs.write(`${Form.id}&-&${JSON.stringify(Object.fromEntries(Object.entries(Form.buttons).sort((a, b) => Number(a[0]) - Number(b[0])))).replace(/"/g, '$-$')}`, Number(Form.id));
        if (await confirmForm(player, '§a§lSuccess!', `The form "§e${Form.name}§r" has been updated. Do you want to update something else?`)) {
            const f = await findForm(player);
            if (!f)
                return creations(player);
            if (f === true)
                return;
            return configure(player, f);
        }
        else
            player.send('Goodbye!');
    });
}
function removeButton(player, Form) {
    const buttons = Object.entries(Form.buttons), form = new ActionForm();
    form.setTitle('§4§lDelete a property');
    form.setBody([
        `Form Title: §a${Form.name}`,
        `§rBody: §a${Form.body}`,
        `§rAmount of Properties (buttons): §a${buttons?.length}`,
    ].join('\n'));
    buttons.forEach(b => form.addButton(`§nName:§r ${b[1][0]}§r\n§nCMD:§r §c${b[1][2].slice(0, 9)}${b[1][2].length ? b[1][2].length > 9 ? '...' : '' : 'N/A'}`, !Form.type && b[1][1].length ? b[1][1] : undefined));
    form.addButton('§c§lCancel', 'textures/ROT/forms/Director Mode/leave.png');
    form.send(player, async (res) => {
        if (res.canceled || res.selection === buttons.length)
            return editButtons(player, Form);
        DM.form.regBTNs.deleteMany(DM.form.regBTNs.findMany(Number(Form.id)));
        await sleep(10);
        delete Form.buttons[res.selection];
        DM.form.regBTNs.write(`${Form.id}&-&${JSON.stringify(Object.fromEntries(Object.entries(Form.buttons).sort((a, b) => Number(a[0]) - Number(b[0])))).replace(/"/g, '$-$')}`, Number(Form.id));
        if (await confirmForm(player, '§a§lSuccess!', `The form "§e${Form.name}§r" has been updated. Do you want to update something else?`)) {
            const f = await findForm(player);
            if (!f)
                return creations(player);
            if (f === true)
                return;
            return configure(player, f);
        }
        else
            player.send('Goodbye!');
    });
}
import "./load.js";
import './open.js';
