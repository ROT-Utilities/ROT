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
/**
 * DEV COMMAND
 */
import { ItemStack, MinecraftBlockTypes, Player, system } from "@minecraft/server";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import { world } from "@minecraft/server";
const cmd = Commands.create({
    name: 'editstick',
    category: 'Dev',
    admin: true
});
const item = new ItemStack('minecraft:stick', 1);
item.nameTag = '§bEdit Stick';
item.setLore(['§cDelete', '§7Hit to select', '§aClick to change stick type']);
item.keepOnDeath = true;
const isStick = (item) => {
    if (item.typeId !== 'minecraft:stick')
        return false;
    if (item.nameTag !== '§bEdit Stick')
        return false;
    if (!item.keepOnDeath)
        return false;
    return true;
};
const getStickType = (item) => {
    return item.getLore()[0].replace(/§(.{1})/gi, '').toLowerCase();
};
cmd.startingArgs('clear', false);
cmd.callback((plr, args) => {
    if (args.length)
        return;
    //@ts-ignore
    const inv = plr.getComponent('inventory').container;
    const slot = inv.getSlot(plr.selectedSlot);
    system.run(() => slot.setItem(item));
});
const interactions = {};
cmd.dynamicType('clear', 'clear', (plr) => {
    delete interactions[plr.id];
    interactions[plr.id] = { toDelete: [], toPaste: [], toFill: [] };
    plr.sendMessage('§aDeleted your history!');
});
world.afterEvents.blockBreak.subscribe((res) => {
    //@ts-ignore
    const inv = res.player.getComponent('inventory').container;
    const item = inv.getItem(res.player.selectedSlot);
    if (!item)
        return;
    if (!isStick(item))
        return;
    res.block.setPermutation(res.brokenBlockPermutation);
});
world.afterEvents.blockPlace.subscribe((res) => {
    if (interactions[res.player.id].toFill.length !== 2)
        return;
    const p = res.player;
    const i = interactions[p.id].toFill;
    interactions[p.id].toFill = [];
    const { x: x1, y: y1, z: z1 } = i[0], { x: x2, y: y2, z: z2 } = i[1];
    const e = p.dimension.fillBlocks({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }, res.block.type);
    p.sendMessage(`§aFilled §c${e}§a blocks!`);
});
world.afterEvents.entityHitBlock.subscribe((res) => {
    if (!(res.damagingEntity instanceof Player))
        return;
    const block = res.hitBlock;
    const p = res.damagingEntity;
    //@ts-ignore
    const inv = p.getComponent('inventory').container;
    const itemStack = inv.getItem(p.selectedSlot);
    if (!itemStack)
        return;
    if (!isStick(itemStack))
        return;
    const stickType = getStickType(itemStack);
    switch (stickType) {
        case 'delete':
            if (interactions[p.id].toDelete.length === 2)
                return (system.run(() => {
                    p.sendMessage('§cDelete the previous locations first!'),
                        p.playSound('mob.zombie.woodbreak', { volume: 1, pitch: 1 });
                }));
            const len = interactions[p.id].toDelete.length;
            system.run(() => {
                p.sendMessage(`§aSuccesfully set delete location ${len + 1}`);
                p.playSound('random.levelup');
            });
            interactions[p.id].toDelete.push({ x: ~~(block.location.x), y: ~~(block.location.y), z: ~~(block.location.z) });
            break;
        case 'copy':
            if (interactions[p.id].toPaste.length === 2)
                return (system.run(() => {
                    p.sendMessage('§cDelete the previous locations first!'),
                        p.playSound('mob.zombie.woodbreak', { volume: 1, pitch: 1 });
                }));
            const len2 = interactions[p.id].toPaste.length;
            system.run(() => {
                p.sendMessage(`§aSuccesfully set paste location ${len2 + 1}`);
                p.playSound('random.levelup');
            });
            interactions[p.id].toPaste.push({ x: ~~(block.location.x), y: ~~(block.location.y), z: ~~(block.location.z) });
            break;
        case 'fill':
            if (interactions[p.id].toFill.length === 2)
                return (system.run(() => {
                    p.sendMessage('§cDelete the previous locations first!'),
                        p.playSound('mob.zombie.woodbreak', { volume: 1, pitch: 1 });
                }));
            const len3 = interactions[p.id].toFill.length;
            system.run(() => {
                p.sendMessage(`§aSuccesfully set fill location ${len3 + 1}`);
                p.playSound('random.levelup');
            });
            interactions[p.id].toFill.push({ x: ~~(block.location.x), y: ~~(block.location.y), z: ~~(block.location.z) });
            break;
    }
});
system.runInterval(() => {
    for (const p of world.getPlayers()) {
        if (!p.isSneaking)
            continue;
        //@ts-ignore
        const inv = p.getComponent('inventory').container;
        const item = inv.getItem(p.selectedSlot);
        if (!isStick(item))
            continue;
        const type = getStickType(item);
        if (type === 'copy' && interactions[p.id].toPaste.length === 2) {
            const i = interactions[p.id].toPaste;
            interactions[p.id].toPaste = [];
            const { x: x1, y: y1, z: z1 } = i[0], { x: x2, y: y2, z: z2 } = i[1];
            p.runCommandAsync(`clone ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} ~ ~ ~`).then(r => {
                if (r.successCount)
                    p.sendMessage('§aPasted!');
            }).catch(() => p.sendMessage('§cAn error ocurred while trying to paste!'));
        }
        if (type === 'delete' && interactions[p.id].toDelete.length === 2) {
            const i = interactions[p.id].toDelete;
            interactions[p.id].toDelete = [];
            const { x: x1, y: y1, z: z1 } = i[0], { x: x2, y: y2, z: z2 } = i[1];
            const e = p.dimension.fillBlocks({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }, MinecraftBlockTypes.air);
            if (e > 0)
                p.sendMessage('§aDeleted!');
            else
                p.sendMessage('§cAn error ocurred while trying to delete location');
        }
    }
});
world.afterEvents.itemUse.subscribe((res) => {
    if (!isStick(res.itemStack))
        return;
    if (!(res.source instanceof Player))
        return;
    const t = getStickType(res.itemStack);
    const i = res.itemStack;
    const p = res.source;
    //@ts-ignore
    const inv = res.source.getComponent('inventory').container;
    if (t === 'copy') {
        const l = i.getLore();
        l[0] = '§bFill';
        i.setLore(l);
        inv.getSlot(p.selectedSlot).setItem(i);
        p.sendMessage('§aChanged to §bfill §atype');
        p.playSound('random.click');
    }
    else if (t === 'delete') {
        const l = i.getLore();
        l[0] = '§aCopy';
        i.setLore(l);
        inv.getSlot(p.selectedSlot).setItem(i);
        p.sendMessage('§aChanged to §ecopy §atype');
        p.playSound('random.click');
    }
    else if (t === 'fill') {
        const l = i.getLore();
        l[0] = '§cDelete';
        i.setLore(l);
        inv.getSlot(p.selectedSlot).setItem(i);
        p.sendMessage('§aChanged to §cdelete §atype');
        p.playSound('random.click');
    }
});
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (!interactions[player.id])
            interactions[player.id] = { toDelete: [], toPaste: [], toFill: [] };
    }
}, 20);
world.afterEvents.playerLeave.subscribe((p) => delete interactions[p.playerId]);
