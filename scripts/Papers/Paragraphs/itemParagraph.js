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
import { ItemStack, EnchantmentTypes, ItemTypes, Enchantment } from "@minecraft/server";
import quick from "../../quick.js";
export const getItemData = (item) => {
    if (!item)
        return;
    const itemData = {
        id: item.typeId,
        amount: item.amount,
        nameTag: item.nameTag,
        lore: item.getLore(),
        enchantments: [],
    };
    if (!item.hasComponent("enchantments"))
        return itemData;
    const enchants = item.getComponent('enchantments')?.enchantments;
    for (let k of quick.enchantmentList) {
        const type = EnchantmentTypes.get(k);
        if (!type || !enchants.hasEnchantment(k))
            continue;
        const enchant = enchants.getEnchantment(type);
        itemData.enchantments.push({
            id: enchant.type.id,
            level: enchant.level,
        });
    }
    return itemData;
};
/**
   * This function allows you to create a new itemStack instance with the data saved with the getItemData function.
   * @param {ItemData} itemData - The data saved to create a new item
   * @returns {itemStack}
*/
export const newItem = (itemData, optionalAmount) => {
    const item = new ItemStack(ItemTypes.get(itemData.id), optionalAmount ?? itemData.amount);
    item.nameTag = itemData.nameTag;
    item.setLore(itemData.lore);
    const enchComp = item.getComponent("enchantments"), enchants = enchComp?.enchantments;
    if (enchants) {
        for (let enchant of itemData.enchantments) {
            const key = enchant.id
                .replace("minecraft:", "")
                .replace(/_(.)/g, (match) => match[1].toUpperCase());
            enchants.addEnchantment(new Enchantment(key, enchant.level));
        }
        enchComp.enchantments = enchants;
    }
    return item;
};
