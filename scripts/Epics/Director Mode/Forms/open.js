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
import { world, Player as IPlayer, system } from "@minecraft/server";
import { ActionForm, MessageForm, ModalForm } from "../../../Papers/FormPaper.js";
import { DM } from "../main.js";
import Player from "../../../Papers/PlayerPaper.js";
world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {
    if (!(source instanceof IPlayer))
        return;
    const form = Object.entries(DM.form.forms).find(form => form[1].item === itemStack.typeId)?.[0];
    if (form)
        return openForm(source, DM.form.forms[form]);
});
system.runInterval(() => {
    if (system.currentTick < 20)
        return;
    const entries = Object.entries(DM.form.forms).map(f => [f[0], f[1].tag]);
    world.getAllPlayers().forEach(player => {
        const tags = player.getTags(), form = entries.find(f => tags.includes(f[1]))?.[0];
        if (!form || !Player.isConnected(player))
            return;
        player.removeTag(DM.form.forms[form].tag);
        openForm(player, DM.form.forms[form]);
    });
}, 20);
function openForm(player, data) {
    data.base.length && data.base?.split(';').forEach(c => { try {
        Player.asyncCommandPaper(player, c);
    }
    catch { } ; });
    if (!data.type)
        openBUTTON(player, data);
    else if (data.type === 1)
        openConfirm(player, data);
    else
        openInput(player, data);
}
function openBUTTON(player, data) {
    const form = new ActionForm(), value = Object.values(data.buttons);
    form.setTitle(data.name);
    form.setBody(data.body);
    value.forEach(b => form.addButton(b[0], b[1]?.length ? b[1] : undefined));
    form.send(player, res => !res.canceled && value[res.selection][2]?.split(';').forEach(c => { try {
        c.length && Player.asyncCommandPaper(player, c);
    }
    catch { } ; }));
}
function openConfirm(player, data) {
    const form = new MessageForm(), value = Object.values(data.buttons);
    form.setTitle(data.name);
    form.setBody(data.body);
    form.setButton1(value[0]?.[0] ?? '');
    form.setButton2(value[1]?.[0] ?? '');
    form.send(player, res => !res.canceled && value[res.selection]?.[2]?.split(';').forEach(c => { try {
        c.length && Player.asyncCommandPaper(player, c);
    }
    catch { } ; }));
}
function openInput(player, data) {
    const form = new ModalForm(), value = Object.values(data.buttons);
    form.setTitle(data.name);
    value.forEach(b => form[b[3] ? 'addToggle' : 'addInput'](b[0]));
    form.send(player, res => {
        if (res.canceled)
            return;
        value.forEach((_, i) => {
            value[i][2]?.replace(/\$text/g, res.formValues[i])?.split(';').forEach(c => { try {
                c.length && Player.asyncCommandPaper(player, c);
            }
            catch { } ; });
        });
    });
}
