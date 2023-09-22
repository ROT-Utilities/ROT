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
import { world, Player as IPlayer } from '@minecraft/server';
import { grammarText } from '../../Papers/Paragraphs/ExtrasParagraphs.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import Player from '../../Papers/PlayerPaper.js';
let use = null;
let hit = null;
let first = null;
(async function () {
    use = await Database.register('click-use', 'ROT');
    hit = await Database.register('click-hit', 'ROT');
})();
const cmd = Commands.create({
    name: 'click',
    description: 'Run a command when you click or hit with a item',
    aliases: ['lick', 'clk'],
    category: 'Miscellaneous',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['use', 'hit']);
cmd.dynamicType('use', ['use', 'click'], () => first = true, ['add', 'remove']);
cmd.dynamicType('hit', ['hit', 'punch'], () => first = false, ['add', 'remove']);
cmd.staticType('add', 'add', null, 'any', false);
cmd.staticType('remove', 'remove', player => {
    const inventory = player.getComponent('minecraft:inventory').container, item = inventory.getItem(player.selectedSlot);
    if (!item?.typeId)
        return player.error('You must be holding a real item');
    player.send(`The ${first ? 'use' : 'hit'} command "§a${first ? use.read(item.typeId) : hit.read(item.typeId)}§r§e" has been added to the item §6${grammarText(item.typeId)}§e!`);
    if (first)
        use.delete(item.typeId);
    else
        hit.delete(item.typeId);
    first = null;
}, null, false);
cmd.unknownType('any', (player, value) => {
    const everything = value?.join(' ');
    if (!value?.length)
        return player.error('You have to type something or remove the hit/click.');
    const inventory = player.getComponent('minecraft:inventory').container, item = inventory.getItem(player.selectedSlot);
    if (!item?.typeId)
        return player.error('You must be holding a real item');
    if (first) {
        use.delete(item.typeId);
        use.write(item.typeId, everything);
    }
    else {
        hit.delete(item.typeId);
        hit.write(item.typeId, everything);
    }
    player.send(`The ${first ? 'use' : 'hit'} command "§a${everything}§r§e" has been added to the item §6${grammarText(item.typeId)}§e!`);
    first = null;
});
world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {
    if (!(source instanceof IPlayer) || !use.has(itemStack?.typeId))
        return;
    Player.asyncCommandPaper(source, use.read(itemStack.typeId));
});
world.afterEvents.entityHitBlock.subscribe(({ damagingEntity }) => {
    if (!(damagingEntity instanceof IPlayer))
        return;
    const item = damagingEntity.getComponent('minecraft:inventory').container.getItem(damagingEntity.selectedSlot);
    if (!hit.has(item?.typeId))
        return;
    Player.asyncCommandPaper(damagingEntity, hit.read(item.typeId));
});
world.afterEvents.entityHitEntity.subscribe(({ damagingEntity }) => {
    if (!(damagingEntity instanceof IPlayer))
        return;
    const item = damagingEntity.getComponent('minecraft:inventory').container.getItem(damagingEntity.selectedSlot);
    if (!hit.has(item?.typeId))
        return;
    Player.asyncCommandPaper(damagingEntity, hit.read(item.typeId));
});
