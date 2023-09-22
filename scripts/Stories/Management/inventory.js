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
import { EquipmentSlot, system } from "@minecraft/server";
import { getItemData } from "../../Papers/Paragraphs/itemParagraph.js";
import { ChestGui } from "../../Papers/ChestGuiPaper.js";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
const cmd = Commands.create({
    name: 'inven',
    description: 'This command will let you see another player\'s inventory.',
    aliases: ['inventory', 'see', 'inven-see', 'inven-see', 'inv'],
    category: 'Management',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['inv', 'chat', 'form']);
cmd.playerType('plr', null, true, [], { self: true });
cmd.dynamicType('inv', ['inv', 'inven', 'inventory'], (plr, _, target) => {
    const tarInv = target[0].getComponent('inventory').container, tarEquipInv = target[0].getComponent('minecraft:equippable'), plrInv = plr.getComponent('inventory').container, plrEquipInv = target[0].getComponent('minecraft:equippable');
    plrInv.clearAll();
    for (let i = 0; i < tarInv.size; i++) {
        const item = tarInv.getItem(i);
        if (!item)
            continue;
        plrInv.setItem(i, item.clone());
    }
    Object.keys(EquipmentSlot).forEach((k) => {
        if (!tarEquipInv.getEquipment(k))
            return;
        plrEquipInv.setEquipment(k, tarEquipInv.getEquipment(k));
    });
    plr.send(`Your inventory has been replace with a exact copy of §c${target[0].name}'s§e inventory.`);
}, 'plr');
cmd.dynamicType('chat', ['chat', 'cht', 'text', 'txt'], (plr, _, target) => {
    const items = [], tarInv = target[0].getComponent('inventory').container, tarEquipInv = target[0].getComponent('minecraft:equippable');
    for (let i = 0; i < tarInv.size; i++) {
        const item = tarInv.getItem(i);
        if (!item)
            continue;
        items.push(`§a${item.type.id}§e, amount: §a${item.amount}§e, lore: §a${item.getLore().join(' §e(next line)§a ') || '§cnone'}`);
    }
    Object.keys(EquipmentSlot).forEach((k) => {
        if (!tarEquipInv.getEquipment(k))
            return;
        const item = tarEquipInv.getEquipment(k);
        items.push(`§a${item.type.id}§e, amount: §a${item.amount}§e, lore: §a${item.getLore().join(' §e(next line)§a ') || '§cnone'}`);
    });
    plr.sendMessage(items.join('\n'));
    plr.send(`§c${target[0].name}'s§e inventory has been relayed in chat. Keep in mind this is not as accurate as making a copy in your inventory.`);
}, 'plr');
cmd.dynamicType('form', ['form', 'ui', 'gui'], (plr, _, target) => {
    plr.send('Close chat to open form!');
    system.runTimeout(() => {
        const tarInv = target[0].getComponent('inventory').container, tarEquipInv = target[0].getComponent('minecraft:equippable');
        const chestgui = new ChestGui();
        chestgui.setType('large');
        chestgui.title(`${target[0].name}'s inventory`);
        let items = [];
        for (let i = 0; i < chestgui.size; i++)
            items.push([null, null]);
        let index = 0;
        Object.keys(EquipmentSlot).forEach((k) => {
            if (k === EquipmentSlot.Mainhand)
                return;
            const item = tarEquipInv.getEquipment(k);
            if (!item)
                return;
            const enchants = getItemData(item).enchantments;
            chestgui.item(index, item?.nameTag ?? formatString(item.typeId.replace('minecraft:', '')), item?.getLore() ?? [], item.typeId, item.amount, Boolean(enchants.length), enchants);
            index++;
        });
        index = 5;
        for (let i = 0; i < tarInv.size; i++) {
            const item = tarInv.getItem(i);
            if (!item)
                continue;
            const enchants = getItemData(item).enchantments;
            chestgui.item(index, item?.nameTag ?? formatString(item.typeId.replace('minecraft:', '')), item?.getLore() ?? [], item.typeId, item.amount, Boolean(enchants.length), enchants);
            index++;
        }
        chestgui.show(plr).then();
    }, 20);
}, 'plr');
function formatString(input) {
    const words = input.split('_');
    const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return formattedWords.join(' ');
}
