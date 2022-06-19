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
import Server from '../../ServerBook.js';
import { Items, ItemStack } from 'mojang-minecraft';
Server.command.register({
    cancelMessage: true,
    name: 'repair',
    description: 'Repair your damaged items',
    aliases: ['rp', 'rep'],
    category: 'Escape',
    documentation: {
        usage: 'rp <slot|all>',
        information: 'Use this command for repair your items',
        examples: [
            'rp slot',
            'rp all'
        ],
        developers: ['Aex66', 'Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('repair', chatmsg.sender.name)) return;
    //@ts-ignore
    const inventory = chatmsg.sender.getComponent('inventory').container;
    if(!['all', 'many', 'more'].includes(args[0])) {
        const item = inventory.getItem(chatmsg.sender.selectedSlot),
        itemName = item.id.match(/:([\s\S]*)$/)[1].replace(/[\W]/g, ' ').replaceAll('_', ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        if(!item) return Server.eBroadcast('You cannot repair this item!', chatmsg.sender.name, 'REPAIR');
        inventory.setItem(chatmsg.sender.selectedSlot, newItem(item));
        return Server.broadcast(`You have successfully repaired your §c${itemName}§a§8!`, chatmsg.sender.name, 'REPAIR');
    }
    let count = 0;
    for(let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if(!item) continue;
        inventory.setItem(i, newItem(item));
        count++;
    }
    Server.broadcast(`Succesfully repaired §c${count}§7 item(s)!`, chatmsg.sender.name, 'REPAIR'); //Aex: Moises I will add all my commands, sudo, near (it is new to get the closest player), give and redeem
    //Ok?
});
const newItem = (item: any) => {
    const newItem = new ItemStack(Items.get(item.id), item.amount, item.data);
    newItem.nameTag = item.nameTag;
    newItem.getComponents = item.getComponents
    newItem.setLore(item.getLore());
    newItem.getComponent('enchantments').enchantments = item.getComponent('enchantments').enchantments;
    return newItem;
};
Server.command.register({
    cancelMessage: true,
    name: 'repairT',
    description: `Toggles ${Server.lang.prefix}repair so members can use ${Server.lang.prefix}repair how you set it to!`,
    aliases: ['rept', 'ret'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'rept',
        examples: [
            'rept'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('repair', chatmsg.sender.name));