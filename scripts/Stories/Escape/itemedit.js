import { Enchantment, Items, ItemStack, MinecraftEnchantmentTypes } from "@minecraft/server";
import quick from "../../main.js";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
const cmd = Commands.create({
    name: 'itemedit',
    description: 'Edit some aspects of an item',
    aliases: ['ie'],
    admin: true,
    category: 'Escape',
    developers: ['Aex66']
});
cmd.startingArgs(['rename', 'lore', 'enchant', 'amount', 'help'], false);
let inv = null;
let item = null;
let clipboard = {};
cmd.callback((plr, args) => {
    if (!args.length)
        return cmd.force('help', 'help');
    inv = plr.getComponent('inventory').container;
    item = inv.getItem(plr.selectedSlot);
});
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
//rename <name: string>
cmd.staticType('rename', 'rename', (plr, name) => {
    if (!item)
        return;
    item.nameTag = name;
    inv.setItem(plr.selectedSlot, item);
});
//lore <add|set|remove|replace|reset|insert|copy|paste>
cmd.dynamicType('lore', 'lore', null, ['l:add', 'l:set', 'l:remove', 'l:reset', 'l:copy', 'l:paste']);
//add <text: string> adds a new line
cmd.staticType('l:add', 'add', (plr, text) => {
    if (!item)
        return;
    const lore = item.getLore();
    lore.push(text);
    item.setLore(lore);
    inv.setItem(plr.selectedSlot, item);
});
//set <line: number> <text: string>
cmd.staticType('l:set', 'set', (plr, num, args) => {
    if (!item)
        return;
    let line = parseInt(num), text = args[0];
    if (args.length > 1)
        for (let i = 4; i < args.length; i++)
            text += '', text += (args[i]);
    let lore = item.getLore();
    if (args[2] === 'last' && lore.length === 1)
        return cmd.force('l:reset', 'reset');
    line = args[2] === 'last' ? lore.length - 1 : parseInt(line) - 1;
    if (line < 0)
        return;
    for (let i = lore.length; i <= args.length; i++)
        lore.push('');
    lore.splice(line, 0, text);
    lore = lore.flat();
    console.warn(JSON.stringify(lore));
    item.setLore(lore);
    inv.setItem(plr.selectedSlot, item);
}, 'any');
cmd.staticType('l:remove', 'remove', (plr, num) => {
    if (!item)
        return;
    if (item.getLore().length === 0)
        return;
    let lore = item.getLore(), line;
    if (num === 'last')
        line = lore.length - 1;
    else
        line = parseInt(num);
    if (line < 0)
        return plr.error('§cWrong line number', 'ItemEdit');
    if (lore.length < line)
        return;
    lore.splice(line, 1);
    item.setLore(lore);
    inv.setItem(plr.selectedSlot, item);
});
/**
//lore replace <from: string> <to: string>
cmd.staticType('l:replace', 'replace', null, 'l:replace:from', false, true)

//from arg for lore replace
cmd.dynamicType('l:replace:from', '*', (plr, val, args) => {
    const from = val, to = 'PAPUS'
    const lore = item.getLore()
    let text = ''
    lore.forEach((v, i) => text += `${v}${i === lore.length - 1? '' : '\n'}`)
    if (!text.match(/papus/g))
        return;
    console.warn(text)
    text.replace(/papus/g, to)
    item.setLore(text.split('\n'))
    inv.setItem(plr.selectedSlot, item)
})
*/
//lore reset
cmd.dynamicType('l:reset', 'reset', (plr) => {
    if (!item)
        return;
    const newItem = new ItemStack(Items.get(item.typeId), item.amount, item.data);
    newItem.nameTag = item.nameTag;
    newItem.getComponent('enchantments').enchantments = item.getComponent('enchantments').enchantments;
    inv.setItem(plr.selectedSlot, newItem);
});
/**
//lore insert <line: number> <text: string>
cmd.dynamicType('l:insert', 'insert', null, 'l:insert:line')
cmd.numberType('l:insert:line', (plr, num, args) => {
    if (!item)
        return;
}, 'any', { float: false, min: 0 })
*/
//lore copy <keep>
cmd.dynamicType('l:copy', 'copy', (plr, _, args) => {
    if (!item)
        return;
    if (!item.getLore().length)
        return plr.error('You can\'t copy this lore!', 'ItemEdit');
    clipboard[plr.id] = [item.getLore(), args?.[0] ?? false];
    return plr.send('Lore copied', 'ItemEdit');
}, 'anybool', true, 1, false);
//lore paste
cmd.dynamicType('l:paste', 'paste', (plr) => {
    if (!item)
        return;
    if (!clipboard[plr.id])
        return plr.error('You have nothing saved on your clipboard!', 'ItemEdit');
    item.setLore(clipboard[plr.id][0]);
    inv.setItem(plr.selectedSlot, item);
    if (!clipboard[plr.id][1])
        delete clipboard[plr.id];
    return plr.send('Lore pasted', 'ItemEdit');
});
//enchant <enchantmentName: Enchant> <level: number>
cmd.dynamicType('enchant', 'enchant', (plr, _, args) => {
    const id = args[0], level = args[1];
    if (level < 0 || level > 5)
        return plr.error('§cInvalid enchantment level', 'ItemEdit');
    const enchComp = item.getComponent('enchantments');
    const enchants = enchComp?.enchantments;
    const type = MinecraftEnchantmentTypes[id];
    if (!type)
        return;
    if (!enchants)
        return;
    if (level === 0)
        enchants.removeEnchantment(type);
    if (level > 0) {
        enchants.removeEnchantment(type);
        enchants.addEnchantment(new Enchantment(type, level));
    }
    enchComp.enchantments = enchants;
    inv.setItem(plr.selectedSlot, item);
}, 'enchant:id');
//enchant id arg
cmd.dynamicType('enchant:id', Object.keys(MinecraftEnchantmentTypes), null, 'enchant:level');
//enchant level arg
cmd.numberType('enchant:level', null, null, { min: 1, max: 5, float: false });
cmd.dynamicType('amount', 'amount', (plr, _, args) => {
    const newItem = new ItemStack(Items.get(item.typeId), args[0], item.data);
    newItem.nameTag = item.nameTag;
    newItem.getComponent('enchantments').enchantments = item.getComponent('enchantments').enchantments;
    newItem.setLore(item.getLore());
    inv.setItem(plr.selectedSlot, newItem);
}, 'number');
//help command
cmd.dynamicType('help', 'help', (plr) => plr.tell(`§e_____.[ §6HELP "ie"§e ]._______\n§6${quick.prefix}help§r\n§6${quick.prefix}ie rename §b<name: string> §eSet item nameTag§r\n§6${quick.prefix}ie lore add §b<text: string> §eAdd a new lore line§r\n§6${quick.prefix}ie lore set §b<line: number> <text: string> §ePlace text at a specific position§r\n§6${quick.prefix}ie lore remove §b<line: number> §eRemoves a specific lore line§r\n§6${quick.prefix}ie lore reset §eRemove the item's lore§r\n§6${quick.prefix}ie lore copy §b[keep: boolean] §eCopy the lore of the item you have in hand§r\n§6${quick.prefix}ie lore paste §ePaste the lore you have saved on your clipboard§r\n§6${quick.prefix}ie enchant §b<enchantmentName: Enchant> <level: number> §eAdd or remove enchantments from your item§r\n§6${quick.prefix}ie amount §b<amount: number> §eSet the item amount§r`));
