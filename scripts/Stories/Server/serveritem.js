import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import Database from "../../Papers/DatabasePaper.js";
import { getItemData, newItem } from "../../Papers/paragraphs/itemParagraph.js";
const cmd = Commands.create({
    name: 'serveritem',
    description: 'Save custom items on your server!',
    aliases: ['si'],
    admin: true,
    category: 'Server',
    developers: ['Aex66']
});
const si = Database.register('ServerItems');
//add giveall and do help
cmd.startingArgs(['save', 'delete', 'give', 'help'], false);
cmd.callback((plr, args) => !args.length && cmd.force('help', 'help'));
/**
 * Argument for multiple args, subCommands or subGroups
 */
cmd.unknownType('any', null);
/**
 * Boolean argument for multiple args, subCommands or subGroups
 */
cmd.booleanType('anybool', undefined);
/**
 * Number argument for multiple args, subCommands or subGroups
 */
cmd.numberType('number', undefined, undefined, { float: false, min: 0 });
//save <id: string>;
cmd.staticType('save', 'save', (plr, id) => {
    let inv = plr.getComponent('inventory').container, item = inv.getItem(plr.selectedSlot);
    if (!item)
        return plr.error('You must have the item in your hand!', 'ServerItem');
    if (si.has(id))
        return plr.error(`There is already an item with the ID §6${id}`);
    plr.send(`item §6${id} §eregistered`, 'ServerItem');
    si.write(id, getItemData(item));
});
//delete <id: string>
cmd.staticType('delete', 'delyeet', (plr, id) => {
    if (!si.has(id))
        return plr.error(`There is no item registered with the id §6${id}`);
    plr.send(`item §6${id}§e has been removed from the database`);
    si.delete(id);
});
cmd.dynamicType('give', 'give', (plr, _, args) => {
    const player = args[0], amount = args[1], id = args[2], silent = args[3];
    if (!si.has(id))
        return plr.error(`There is no item registered with the id §6${id}`);
    const item = newItem(si.read(id), amount);
    const inv = player.getComponent('inventory').container;
    if (inv.emptySlotsCount === 0)
        return plr.send(`§6${player.name} §edoes not have enough space in their inventory`);
    if (!silent)
        player.send(`Obtained §b${amount} §eof §r${item?.nameTag ?? item.typeId}`, 'Server');
    inv.addItem(item);
}, 'g:player', false);
//give player arg
cmd.playerType('g:player', null, true, 'g:amount', { self: true });
//give player amount arg
cmd.numberType('g:amount', null, 'g:id', { min: 1, float: false });
//give player amount id arg
cmd.unknownType('g:id', null, 1, 'g:silent', false);
//give player amount id silent arg
cmd.booleanType('g:silent', null);
cmd.dynamicType('help', 'help', () => { }, null, false);
