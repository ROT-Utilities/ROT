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
Server.command.register({
    cancelMessage: true,
    name: 'inven',
    description: 'This command will let you see another player\'s inventory.',
    aliases: ['inventory', 'see', 'inven-see','inven-see', 'inv'],
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'inv <inv|chest|chat> <player>',
        information: 'This command will let you look into another player\'s inventory by either placing a chest with an exact copy of their inventory, replace your inventory with their inventory, or tell you what items they have in there in chat.',
        notes: '§6§lSpecial thanks to §r§e@baboonie#2522§6§l on §1Discord§6 for letting me use his inventory gametest addon. I just made it so you can make it replace your inventory or and put it in a chest. The rest was his work!',
        examples: [
            'inv inv Mo9ses (§4§lWARNIMG: This WILL /clear YOU!§r§5)',
            'inventory chest Mo9ses',
            'inv-see chat baboonie',
            'see chest baboonie'
        ],
        developers: ['Mo9ses', 'baboonie']
    }
}, (chatmsg, args) => {
    const inv = ['inv', 'inventory', 'inside', 'me', 'inside-me-daddy', 'i'], chest = ['chest', 'block', 'outside', 'kit', 'c'], chat = ['chat', 'core', 'mid', 'tell', 'read','view'], player = args.slice(1).join(' ');
    if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'INVEN');
    if(player === chatmsg.sender.name) Server.eBroadcast('Why do you want to see your own inventory? Whatever', chatmsg.sender.name, 'INVEN');
    // @ts-ignore
    const container = Server.player.fetch(player).getComponent('inventory').container, items = [];
    for(let i = 0; i < container.size;) {
        let slot = container.getItem(i);
        let itemData = {
          slot: i,
          id: slot?.id ?? 'minecraft:air',
          amount: slot?.amount ?? 1,
          data: slot?.data ?? '',
        }
        items.push(itemData);
        i++;
    } let i = 0;
    if(inv.includes(args[0])) {
        items?.forEach(item => {
            i++;
            if(i <= 8) Server.runCommand(`replaceitem entity "${chatmsg.sender.name}" slot.hotbar ${item.slot} ${item.id} ${item.amount} ${item.data}`);else if(i <= 17) Server.runCommand(`replaceitem entity "${chatmsg.sender.name}" slot.inventory ${item.slot-9} ${item.id} ${item.amount} ${item.data}`);else if(i <= 26) Server.runCommand(`replaceitem entity "${chatmsg.sender.name}" slot.inventory ${item.slot-9} ${item.id} ${item.amount} ${item.data}`);else if(i <= 34) Server.runCommand(`replaceitem entity "${chatmsg.sender.name}" slot.inventory ${item.slot-9} ${item.id} ${item.amount} ${item.data}`);
        });
        return Server.broadcast(`Your inventory has been replaced with §c${player}'s§7 inventory!`, chatmsg.sender.name, 'INVEN-SEE');
    }
    if(chest.includes(args[0])) {
        Server.runCommand(`execute "${chatmsg.sender.name}" ~~~ fill ~~~ ~~1~ chest 0 replace air`);
        items?.forEach(item => {
            if(i <= 8) Server.runCommand(`execute "${chatmsg.sender.name}" ~~~ replaceitem block ~~~ slot.container ${item.slot} ${item.id} ${item.amount} ${item.data}`); else if(i <= 17) Server.runCommand(`execute "${chatmsg.sender.name}" ~~~ replaceitem block ~~1~ slot.container ${item.slot-9} ${item.id} ${item.amount} ${item.data}`); else if(i <= 26) Server.runCommand(`execute "${chatmsg.sender.name}" ~~~ replaceitem block ~~1~ slot.container ${item.slot-9} ${item.id} ${item.amount} ${item.data}`); else if(i <= 34) Server.runCommand(`execute "${chatmsg.sender.name}" ~~~ replaceitem block ~~1~ slot.container ${item.slot-9} ${item.id} ${item.amount} ${item.data}`);
            i++;
        });
        return Server.broadcast(`§c${player}'s§7 inventory has been copied into a §ctwo§7 chest!`, chatmsg.sender.name, 'INVEN-SEE');
    }
    if(chat.includes(args[0])) {
        let allItems = '';
        items?.forEach(item => {
            let slot = `§8Slot: §6${item.slot ? item.slot++ : 0}§8, `,
            id = item.id ? `§8ID: §6${item.id}§8, ` : '',
            amount = item.amount ? `Amount: §6${item.amount}§8, ` : '',
            data = item.data ? `Data: §6${item.data}` : '';
            allItems += '\n' + slot + id + amount + data;
        });
        return Server.broadcast(allItems + `\n§7These are all the items in §c${player}'s§7 inventory!`, chatmsg.sender.name, 'INVEN-SEE');
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'INVEN-SEE');
});