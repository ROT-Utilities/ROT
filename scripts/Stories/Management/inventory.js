import Commands from "../../Papers/CommandPaper/CommandPaper.js";
const cmd = Commands.create({
    name: 'inven',
    description: 'This command will let you see another player\'s inventory.',
    aliases: ['inventory', 'see', 'inven-see', 'inven-see', 'inv'],
    category: 'Management',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['inv', 'chat']);
cmd.playerType('plr', null, true, [], { self: false });
cmd.dynamicType('inv', ['inv', 'inven', 'inventory'], (plr, _, target) => {
    const tarInv = target[0].getComponent('inventory').container, plrInv = plr.getComponent('inventory').container;
    plrInv.clearAll();
    for (let i = 0; i < tarInv.size; i++) {
        const item = tarInv.getItem(i);
        if (!item)
            continue;
        plrInv.setItem(i, item.clone());
    }
    plr.send(`Your inventory has been replace with a exact copy of §c${target[0].name}'s§e inventory.`);
}, 'plr');
cmd.dynamicType('chat', ['chat', 'cht', 'text', 'txt'], (plr, _, target) => {
    const items = [], tarInv = target[0].getComponent('inventory').container;
    for (let i = 0; i < tarInv.size; i++) {
        const item = tarInv.getItem(i);
        if (!item)
            continue;
        items.push(`§a${item.type.id}§e, amount: §a${item.amount}§e, lore: §a${item.getLore().join(' §e(next line)§a ') || '§cnone'}`);
    }
    plr.sendMessage(items.join('\n'));
    plr.send(`§c${target[0].name}'s§e inventory has been relayed in chat. Keep in mind this is not as accurate as making a copy in your inventory.`);
}, 'plr');
