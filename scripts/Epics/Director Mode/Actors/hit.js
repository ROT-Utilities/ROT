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
import { Player as IPayer, system, world } from "@minecraft/server";
import { ActionForm, ModalForm } from "../../../Papers/FormPaper.js";
import { ID, confirmForm, sleep } from "../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { bigAmount, skins } from "./skins.js";
import { ACT } from "./main.js";
import { DM } from "../main.js";
import Player from "../../../Papers/PlayerPaper.js";
export const carry = {};
world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
    if (!(damagingEntity instanceof IPayer) || hitEntity?.typeId !== 'rot:actor')
        return;
    const rID = hitEntity.getTags().find(tag => tag.startsWith('rID:'))?.slice(4), admin = Player.isAdmin(damagingEntity);
    if (!rID)
        if (admin)
            return assignActor(damagingEntity, hitEntity, rID, true);
        else
            Player.error(damagingEntity, 'You cannot assign roles if you aren\'t a admin.');
    if (admin && damagingEntity.isSneaking)
        return assignActor(damagingEntity, hitEntity, rID, false);
    hitActor(damagingEntity, rID);
});
export async function hitActor(player, rID) {
    const cmd = ACT.actors[rID]?.[0];
    if (!cmd || !cmd?.[0]?.length)
        return;
    cmd.forEach(c => { try {
        Player.asyncCommandPaper(player, c);
    }
    catch { } ; });
}
async function assignActor(plr, actor, rID, newActor) {
    const player = Player.playerType(plr, { from: 'Actor', sound: false });
    if (newActor) {
        const rID = ID();
        return system.run(() => {
            actor.addTag(`rID:${rID}`);
            edit(player, actor, rID);
        });
    }
    const form = new ActionForm();
    form.setTitle(actor.nameTag);
    form.addButton('§a§lMove actor', 'textures/ROT/forms/Director Mode/global.png'); //Sneak to drop actor
    form.addButton('§6§lEdit skin', 'textures/ROT/forms/Director Mode/custom.png');
    form.addButton('§7§lEdit actor', 'textures/ROT/forms/Director Mode/information.png');
    form.addButton('§c§lRemove actor', 'textures/ROT/forms/Director Mode/redstone.png');
    form.addButton('§4§lClose', 'textures/ROT/forms/Director Mode/leave.png');
    form.send(plr, async (res) => {
        if (res.canceled || res.selection === 4)
            return player.send('Goodbye Director!');
        if (res.selection === 1)
            return skin(player, actor, rID);
        if (res.selection === 2)
            return edit(player, actor, rID);
        if (res.selection === 0) {
            const move = new ModalForm();
            move.setTitle(`§a§lMove§r ${actor.nameTag}§r§a§l?`);
            move.addInput('§cX:', `${actor.location.x}`, `${actor.location.x}`);
            move.addInput('§1Y:', `${actor.location.x}`, `${actor.location.y}`);
            move.addInput('§aX:', `${actor.location.x}`, `${actor.location.z}`);
            move.addToggle('§aClone NPC (clone and teleport NPC)', false);
            return move.send(player, async (res) => {
                if (res.canceled)
                    return assignActor(player, actor, rID, false);
                const x = parseInt(res.formValues[0]) + .5, y = parseInt(res.formValues[1]), z = parseInt(res.formValues[2]) + .5;
                if (isNaN(x) || isNaN(y) || isNaN(z))
                    return player.error('Make sure you are typing numbers.');
                await player.runCommandAsync(`tickingarea remove actorClone`);
                await player.runCommandAsync(`tickingarea add circle ${res.formValues[0]} ${res.formValues[1]} ${res.formValues[2]} 1 actorClone`);
                if (!res.formValues[3]) {
                    system.run(() => actor.teleport({ x, y, z }));
                    player.runCommandAsync(`tickingarea remove actorClone`);
                    return player.send(`The Actor has been teleported to §a${res.formValues[0]}§e, §a${res.formValues[1]}§e, §a${res.formValues[2]}§e.`);
                }
                const actorSummon = world.afterEvents.entitySpawn.subscribe(async ({ entity }) => {
                    if (entity?.typeId !== 'rot:actor')
                        return;
                    world.afterEvents.entitySpawn.subscribe(actorSummon);
                    await sleep(35);
                    system.run(() => {
                        const newID = ID(), data = ACT.actors[rID];
                        entity.addTag(`rID:${newID}`);
                        ACT.actorREG.write(`${newID}&-&${JSON.stringify([data[0].join(';'), data[1], data[2]]).replace(/\"/g, '$-$')}`, Number(newID));
                        ACT.actors[newID] = [data[0], data[1], data[2], false];
                        entity.getComponent('minecraft:mark_variant').value = actor.getComponent('minecraft:mark_variant').value;
                        entity.nameTag = actor.nameTag;
                        entity.runCommandAsync(`tickingarea remove actorClone`);
                    });
                });
                player.dimension.spawnEntity('rot:actor', { x, y, z });
                return player.send(`The Actor has been cloned and teleported to §a${res.formValues[0]}§e, §a${res.formValues[1]}§e, §a${res.formValues[2]}§e.`);
            });
        }
        if (await confirmForm(player, `§c§lRemove§r ${actor.nameTag}§r§c§l?`, `Are you sure you want to remove this actor?`)) {
            player.send(`The actor "§r${actor.nameTag}§r§e" has successfully been removed.`);
            ACT.actorREG.findMany(Number(rID)).forEach(a => ACT.actorREG.delete(a));
            actor.triggerEvent('rot:despawn');
            return delete ACT.actors[rID];
        }
        assignActor(player, actor, rID, false);
    });
}
function skin(player, actor, rID) {
    const form = new ActionForm();
    form.setTitle(`§gChanging the skin of§r ${actor.nameTag}§r§6?`);
    form.addButton('§2§lNormal sized skin', 'textures/ROT/forms/Director Mode/big.png');
    form.addButton('§a§lSlim skin size', 'textures/ROT/forms/Director Mode/slim.png');
    form.addButton('§c§lBack', 'textures/ROT/forms/Director Mode/leave.png');
    form.send(player, res => {
        if (res.canceled || res.selection === 2)
            return assignActor(player, actor, rID, false);
        if (res.selection === 0)
            return skinPage(player, actor, rID, true, 1, true);
        if (res.selection === 1)
            return skinPage(player, actor, rID, false, 1, true);
    });
}
function skinPage(player, actor, rID, big, page, first) {
    const mark = actor.getComponent('minecraft:mark_variant').value, key = Object.entries(skins[big ? 'b' : 's']), len = key.length, skinList = new Array(Math.ceil(key.length / 25)).fill(0).map(_ => key.splice(0, 25));
    if (first && page === 1 && big && mark < bigAmount)
        page = ~~(mark / 25) + 1;
    if (first && page === 1 && !big && mark >= bigAmount)
        page = ~~((mark - bigAmount) / 25) + 1;
    const size = new ActionForm();
    size.setTitle(`§g§lChoose a ${big ? 'Normal' : 'Slim'} Sized Skin`);
    size.setBody(`§aPage ${page}/${skinList.length} §c(${len} skins)§7.\n§7Remember, the skin names are not 100% accurate.`);
    if (page !== skinList.length)
        size.addButton('§a§lNext page', 'textures/ROT/forms/Director Mode/change.png');
    if (page > 1)
        size.addButton('§c§lBack page', 'textures/ROT/forms/Director Mode/change2.png');
    skinList[page - 1].forEach(list => size.addButton(`${list[0]}\n§r§8§oid: ${list[1]}`, `textures/ROT/entity/Actors/${big ? 'big' : 'slim'}/${list[1]}.png`));
    size.send(player, res => {
        if (res.canceled)
            return assignActor(player, actor, rID, false);
        if (page !== skinList.length && res.selection === 0)
            return skinPage(player, actor, rID, big, page + 1, false);
        if (page > 1 && ((res.selection === 1 && page !== skinList.length) || (res.selection === 0 && page === skinList.length)))
            return skinPage(player, actor, rID, big, page - 1, false);
        let index = res.selection;
        if (page !== skinList.length)
            index = index - 1;
        if (page > 1)
            index = index - 1;
        system.run(() => actor.getComponent('minecraft:mark_variant').value = (page - 1) * 25 + index + (big ? 0 : bigAmount));
    });
}
function edit(player, actor, rID) {
    //Add the skin thing
    const form = new ModalForm(), index = DM.config.Actors.scales.indexOf(`${ACT.actors[rID]?.[2]}`);
    form.setTitle(`§7Editing§r ${actor.nameTag}`);
    form.addInput('§7Actor name:', actor.nameTag, actor.nameTag);
    form.addInput('§7Command: (This will execute on the player)', ACT.actors[rID]?.[0]?.join(';') ?? '§cN/A', ACT.actors[rID]?.[0]?.join(';') ?? '');
    form.addDropdown('§7Scale:', DM.config.Actors.scales, index >= 0 ? index : 3);
    form.addDropdown('§7Action:', Object.keys(DM.config.Actors.actions), ACT.actors[rID]?.[1] ?? 0);
    form.send(player, res => {
        if (res.canceled)
            return player.send('Goodbye Director!');
        system.run(() => {
            actor.nameTag = res.formValues[0];
        });
        ACT.actorREG.findMany(Number(rID)).forEach(a => ACT.actorREG.delete(a));
        ACT.actorREG.write(`${rID}&-&${JSON.stringify([res.formValues[1], res.formValues[3], Number(DM.config.Actors.scales[res.formValues[2]])]).replace(/\"/g, '$-$')}`, Number(rID));
        ACT.actors[rID] = [res.formValues[1].split(';'), res.formValues[3], Number(DM.config.Actors.scales[res.formValues[2]]), false];
        player.send('Changes saved.', 'DM');
    });
}
//Move, Edit, Remove
