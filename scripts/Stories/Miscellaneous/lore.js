import { grammarText } from '../../Papers/Paragraphs/ExtrasParagraphs.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
const cmd = Commands.create({
    name: 'lore',
    description: 'Change the lore of a item',
    aliases: ['lre', 'description'],
    category: 'Miscellaneous',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs('any');
cmd.unknownType('any', (player, value) => {
    const inventory = player.getComponent('minecraft:inventory').container, item = inventory.getItem(player.selectedSlot);
    if (!item?.typeId)
        return player.error('You must be holding a real item');
    item.setLore(value.join('\\n').split('\\n'));
    inventory.setItem(player.selectedSlot, item);
    player.send(`Updated item lore on §6${grammarText(item.typeId)}§e!`);
});
