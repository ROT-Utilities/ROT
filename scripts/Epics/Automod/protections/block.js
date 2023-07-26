import { MinecraftBlockTypes, world } from "@minecraft/server";
import { Iblocks } from "../constants.js";
import quick from "../../../quick.js";
import Player from "../../../Papers/PlayerPaper.js";
const config = quick.epics.Automod, instance = config.protections.block;
world.afterEvents.blockPlace.subscribe(res => {
    if (Player.isAdmin(res.player) || res.player.hasTag(config.bypass))
        return;
    if (!Iblocks.includes(res.block.typeId))
        return;
    if (res.block.isAir())
        return;
    res.block.setType(MinecraftBlockTypes.air);
    if (instance.action === 'cancel')
        return;
    if (instance.action === 'kick')
        return world.getDimension('overworld').runCommandAsync(`kick "${res.player.name}" §l§cROT AC\n§r§7Reason: Place ilegal blocks`).catch();
    if (instance.action === 'warn')
        return res.player.runCommandAsync(`scoreboard players add @s warns 1`).catch();
});
