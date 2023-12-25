import { ChestGui } from "../../Papers/ChestGuiPaper";
import Database from "../../Papers/DatabasePaper";
import { getItemData, newItem } from "../../Papers/Paragraphs/itemParagraph";
import { ModalForm } from "../../Papers/FormPaper";
import { ID, confirmForm } from "../../Papers/Paragraphs/ExtrasParagraphs";
import quick from "../../quick";
import { world } from "@minecraft/server";
import Player from "../../Papers/PlayerPaper";
const config = quick.epics['Shop'];
//Imports
import './interval';
//Opening methods
if (config.npc)
    world.afterEvents.entityHitEntity.subscribe(data => {
        if (data.hitEntity?.typeId !== 'rot:shop' || data.damagingEntity.typeId !== 'minecraft:player')
            return;
        const player = Player.playerType(data.damagingEntity, { from: config.npcName, sound: false });
        if (player.isAdmin && player.isSneaking)
            return data.hitEntity.triggerEvent('rot:despawn');
        try {
            main(player);
        }
        catch (e) {
            console.warn(e + e.stack);
            confirmForm(player, 'Shop', '§4Something went wrong while opening the form!', '§aOk', '§cTry again!');
        }
    });
export async function main(player) {
    if (!player.isAdmin)
        shop(player, 1);
    else {
        new ChestGui()
            .setType('small')
            .title('Shop')
            .item(14, '§cAdd Item', ['§aAdd an item to the shop!'], 'minecraft:stick', 1, true, [])
            .item(12, '§cShop', ['§aShows the shop items!'], 'minecraft:golden_carrot', 1, true, [])
            .show(player).then((res) => {
            if (res.canceled)
                return;
            if (res.selection == 14) {
                const form = new ModalForm();
                form.setTitle('Add an item');
                form.addInput('The price of the item:', '10');
                form.send(player, (result) => {
                    if (result.canceled)
                        return;
                    const inv = player.getComponent('inventory').container;
                    if (!inv.getItem(player.selectedSlot))
                        return player.error('You must hold an item to add to the shop!');
                    if (!result.formValues[0] || isNaN(result.formValues[0]))
                        return player.error('The price must be a number!');
                    add(inv.getItem(player.selectedSlot), result.formValues[0]);
                    player.send('Successfully added the item to the shop!');
                });
            }
            else if (res.selection == 12)
                shop(player, 1);
        });
    }
}
function formatString(input) {
    return input.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
async function add(item, price) {
    const db = await Database.register('shop'), itemData = getItemData(item), id = ID();
    db.write(id, {
        item: {
            id: itemData.id,
            amount: itemData.amount,
            enchantments: itemData.enchantments,
            lore: itemData.lore,
            nameTag: itemData.nameTag,
        },
        price: price,
        id: id
    });
}
async function shop(player, page) {
    const db = await Database.register('shop'), values = db.allValues(), pages = Math.ceil(values.length / 45), items = values.slice((page - 1) * 45, (page - 1) * 45 + 45);
    if (!values.length)
        return confirmForm(player, '§cNo shop items', '§4There are no items in the shop that have been added yet...', '§aOk', '§cClose');
    const form = new ChestGui()
        .setType('large')
        .title(`Shop page: ${page}/${pages}`);
    if (page < pages)
        form.item(51, '§aNext page', ['§aShows the next page'], 'minecraft:arrow', 1, true, []);
    if (page > 1)
        form.item(47, '§cPrevious page', ['§cShows the previous page'], 'minecraft:arrow', 1, true, []);
    form.item(49, '§cClose', ['§aClose this page'], 'textures/blocks/barrier', 1, true, []);
    for (let i = 45; i < 54; i++) {
        if (page < pages && i == 51)
            continue;
        if (page > 1 && i == 47)
            continue;
        if (i == 49)
            continue;
        form.item(i, '', [], 'textures/blocks/glass_black', 1, false, []);
    }
    items.forEach((val, i) => {
        const item = val.item;
        form.item(i, item?.nameTag ?? formatString(item.id.replace('minecraft:', '')), [item.lore ?? [], `§7Price: §6${val.price}`], item.id, item.amount, Boolean(item.enchantments.length), item.enchantments);
    });
    form.show(player).then((res) => {
        if (res.canceled)
            return;
        if (res.selection == 51 && page < pages)
            shop(player, page + 1);
        else if (res.selection == 47 && page > 1)
            shop(player, page - 1);
        else if (res.selection <= items.length) {
            const selection = items[res.selection];
            if (player.isAdmin) {
                new ChestGui()
                    .setType('small')
                    .title('Buy item?')
                    .item(12, '§aBuy', ['§aBuy this item?'], 'textures/blocks/glass_lime', 1, false, [])
                    .item(14, '§cRemove item', ['§cRemove this item from the shop?'], 'textures/blocks/glass_red', 1, false, [])
                    .show(player).then((result) => {
                    if (result.canceled)
                        return;
                    if (result.selection == 12) {
                        if (player.getScore(config.currency) < selection.price)
                            return player.error(`You do not have enough ${config.currency} to buy this item!`);
                        const inventory = player.getComponent('inventory').container;
                        if (inventory.emptySlotsCount < 1)
                            return player.error('You do not have enough space to buy this item!');
                        player.setScore(config.currency, player.getScore(config.currency) - selection.price);
                        inventory.addItem(newItem(selection.item));
                        player.send(`You have succssfully bought the item ${selection.item?.nameTag ?? formatString(selection.item.id.replace('minecraft:', ''))}!`);
                    }
                    else if (result.selection == 14) {
                        player.send(`You have succssfully removed the item ${selection.item?.nameTag ?? formatString(selection.item.id.replace('minecraft:', ''))} from the shop!`);
                        db.delete(selection.id);
                    }
                });
            }
            else {
                new ChestGui()
                    .setType('small')
                    .title('Buy item?')
                    .item(12, '§aBuy', ['§aBuy this item?'], 'textures/blocks/glass_lime', 1, false, [])
                    .item(14, '§cCancel', ['§cCancel'], 'textures/blocks/glass_red', 1, false, [])
                    .show(player).then((result) => {
                    if (result.canceled)
                        return;
                    if (result.selection == 12) {
                        if (player.getScore(config.currency) < selection.price)
                            return player.error(`You do not have enough ${config.currency} to buy this item!`);
                        const inventory = player.getComponent('inventory').container;
                        if (inventory.emptySlotsCount < 1)
                            return player.error('You do not have enough space to buy this item!');
                        player.setScore(config.currency, player.getScore(config.currency) - selection.price);
                        inventory.addItem(newItem(selection.item));
                        player.send(`You have succssfully bought the item ${selection.item?.nameTag ?? formatString(selection.item.id.replace('minecraft:', ''))}!`);
                    }
                });
            }
        }
    });
}
