/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer),
notbeer (ROT's base code)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
const repairables = [
    MinecraftItemTypes.netheriteSword.id,
    MinecraftItemTypes.netheriteAxe.id,
    MinecraftItemTypes.netheriteShovel.id,
    MinecraftItemTypes.netheritePickaxe.id,
    MinecraftItemTypes.netheriteHoe.id,
    MinecraftItemTypes.netheriteHelmet.id,
    MinecraftItemTypes.netheriteChestplate.id,
    MinecraftItemTypes.netheriteLeggings.id,
    MinecraftItemTypes.netheriteBoots.id,
    MinecraftItemTypes.diamondSword.id,
    MinecraftItemTypes.diamondAxe.id,
    MinecraftItemTypes.diamondShovel.id,
    MinecraftItemTypes.diamondPickaxe.id,
    MinecraftItemTypes.diamondHoe.id,
    MinecraftItemTypes.diamondHelmet.id,
    MinecraftItemTypes.diamondChestplate.id,
    MinecraftItemTypes.diamondLeggings.id,
    MinecraftItemTypes.diamondBoots.id,
    MinecraftItemTypes.ironSword.id,
    MinecraftItemTypes.ironAxe.id,
    MinecraftItemTypes.ironShovel.id,
    MinecraftItemTypes.ironPickaxe.id,
    MinecraftItemTypes.ironHoe.id,
    MinecraftItemTypes.ironHelmet.id,
    MinecraftItemTypes.ironChestplate.id,
    MinecraftItemTypes.ironLeggings.id,
    MinecraftItemTypes.ironBoots.id,
    MinecraftItemTypes.goldenSword.id,
    MinecraftItemTypes.goldenAxe.id,
    MinecraftItemTypes.goldenShovel.id,
    MinecraftItemTypes.goldenPickaxe.id,
    MinecraftItemTypes.goldenHoe.id,
    MinecraftItemTypes.goldenHelmet.id,
    MinecraftItemTypes.goldenChestplate.id,
    MinecraftItemTypes.goldenLeggings.id,
    MinecraftItemTypes.goldenBoots.id,
    MinecraftItemTypes.stoneSword.id,
    MinecraftItemTypes.stoneAxe.id,
    MinecraftItemTypes.stoneShovel.id,
    MinecraftItemTypes.stonePickaxe.id,
    MinecraftItemTypes.stoneHoe.id,
    MinecraftItemTypes.leatherHelmet.id,
    MinecraftItemTypes.leatherChestplate.id,
    MinecraftItemTypes.leatherLeggings.id,
    MinecraftItemTypes.leatherBoots.id,
    MinecraftItemTypes.chainmailHelmet.id,
    MinecraftItemTypes.chainmailChestplate.id,
    MinecraftItemTypes.chainmailLeggings.id,
    MinecraftItemTypes.chainmailBoots.id,
    MinecraftItemTypes.woodenSword.id,
    MinecraftItemTypes.woodenAxe.id,
    MinecraftItemTypes.woodenShovel.id,
    MinecraftItemTypes.woodenPickaxe.id,
    MinecraftItemTypes.woodenHoe.id,
    MinecraftItemTypes.trident.id,
    MinecraftItemTypes.elytra.id,
    MinecraftItemTypes.flintAndSteel.id,
    MinecraftItemTypes.fishingRod.id,
    MinecraftItemTypes.carrotOnAStick.id,
    MinecraftItemTypes.bow.id,
    MinecraftItemTypes.crossbow.id,
    MinecraftItemTypes.shield.id,
    MinecraftItemTypes.shears.id
];
import { ItemStack, Items, MinecraftItemTypes } from '@minecraft/server';
import Server from '../../ServerBook.js';
const cmd = Server.command.create({
    name: 'repair',
    description: 'Repair your damaged items',
    aliases: ['rp', 'rep'],
    category: 'Escape',
    developers: ['Aex66']
});
cmd.startingArgs(['slot', 'all']);
cmd.dynamicType('slot', ['slot', 'hand'], (plr) => {
    var _a, _b, _c, _d, _e, _f;
    const inventory = plr.getComponent('minecraft:inventory').container;
    const item = inventory.getItem(plr.selectedSlot), itemName = (_f = (_e = (_d = (_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.typeId) === null || _a === void 0 ? void 0 : _a.match(/:([\s\S]*)$/)[1]) === null || _b === void 0 ? void 0 : _b.replace(/[\W]/g, ' ')) === null || _c === void 0 ? void 0 : _c.replaceAll('_', ' ')) === null || _d === void 0 ? void 0 : _d.split(' ')) === null || _e === void 0 ? void 0 : _e.map((w) => { var _a; return ((_a = w === null || w === void 0 ? void 0 : w.charAt(0)) === null || _a === void 0 ? void 0 : _a.toUpperCase()) + (w === null || w === void 0 ? void 0 : w.slice(1)); })) === null || _f === void 0 ? void 0 : _f.join(' ');
    if (!item || !repairables.includes(item === null || item === void 0 ? void 0 : item.typeId))
        return plr.send('You cannot repair this item!', 'REPAIR');
    plr.send(`You have successfully repaired your §c${itemName}§a§8!`, 'REPAIR');
    inventory.setItem(plr.selectedSlot, newItem(item));
}, null, false);
cmd.dynamicType('all', ['all', 'many', 'more'], (plr) => {
    let count = 0;
    const inventory = plr.getComponent('inventory').container;
    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (!item)
            continue;
        if (!repairables.includes(item.typeId))
            continue;
        count++;
        inventory.setItem(i, newItem(item));
    }
    plr.send(`Succesfully repaired §c${count}§7 item(s)!`, 'REPAIR');
}, null, false);
const newItem = (item) => {
    const newItem = new ItemStack(Items.get(item.typeId), item.amount, item.data);
    newItem.nameTag = item.nameTag;
    newItem.getComponents = item.getComponents;
    newItem.setLore(item.getLore());
    newItem.getComponent('enchantments').enchantments = item.getComponent('enchantments').enchantments;
    return newItem;
};
