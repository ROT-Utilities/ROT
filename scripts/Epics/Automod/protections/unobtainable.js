import { system, world } from "@minecraft/server";
import { Iitems } from "../constants.js";
import quick from "../../../quick.js";
import Player from "../../../Papers/PlayerPaper.js";
const config = quick.epics.Automod, instance = config.protections.unobtainable;
system.run(() => {
    for (const player of world.getPlayers()) {
        if (Player.isAdmin(player) || player.hasTag(config.bypass))
            continue;
        const inv = player.getComponent('inventory').container;
        const slot = inv.getSlot(player.selectedSlot);
        if (!slot.getItem())
            continue;
        if (!Iitems.includes(slot.typeId))
            return;
        slot.setItem();
        if (instance.action === 'cancel')
            return;
        if (instance.action === 'kick')
            return world.getDimension('overworld').runCommandAsync(`kick "${player.name}" §l§cROT AC\n§r§7Reason: Having unobtainable items`).catch();
        if (instance.action === 'warn')
            return player.runCommandAsync(`scoreboard players add @s warns 1`).catch();
    }
});
