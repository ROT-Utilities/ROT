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
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { world, Player as IPlayer, ItemStack, MinecraftItemTypes } from "@minecraft/server";
import quick from "../../quick.js";
import { ModalForm } from "../../Papers/FormPaper.js";
import Player from "../../Papers/PlayerPaper.js";
const config = quick.epics.Slappers;
world.events.entityHit.subscribe(res => {
    if (!(res.entity instanceof IPlayer))
        return;
    const player = Player.playerType(res.entity);
    const slapper = res.hitEntity;
    const inv = player.getComponent('inventory').container, item = inv.getItem(player.selectedSlot);
    if (!item)
        return;
    if (item.typeId !== config.editItem[0])
        return;
    if (config.editItem[1] && item.nameTag !== config.editItem[1])
        return;
    if (!player.hasTag(quick.adminTag)) {
        inv.setItem(player.selectedSlot, new ItemStack(MinecraftItemTypes.cookie));
        return player.error('You don\'t have permission to use this item!', 'ROT');
    }
    if (!slapper)
        return;
    if (!slapper.hasTag('isSlapper'))
        return player.error('This is not a slapper!', 'Slappers');
    return edit(player, slapper);
});
export const edit = (player, slapper) => {
    const form = new ModalForm();
    form.setTitle('Edit Slapper');
    form.addInput('Slapper Name', 'Slapper Name', slapper.nameTag);
    form.addInput('Command', 'command', slapper.getTags().find(tag => tag.startsWith('cmd:'))?.substring(4) ?? 'say hey');
    form.send(player, (res) => {
        if (res.canceled)
            return;
        const [name, command] = res.formValues;
        slapper.nameTag = `${name}`;
        const tag = slapper.getTags().find(tag => tag.startsWith('cmd:'));
        if (tag)
            slapper.removeTag(tag);
        slapper.addTag('cmd:' + command);
        player.send('Slapper updated!', 'Slappers');
    });
};
