import { system, world } from "@minecraft/server";
import Player from "../../../Papers/PlayerPaper.js";
import quick from "../../../quick.js";
const config = quick.epics.Automod, instance = config.protections.crasher;
system.runInterval(() => {
    world.getAllPlayers().forEach((plr) => {
        if (~~(plr.location.x) > instance.distance ||
            ~~(plr.location.y) > instance.distance ||
            ~~(plr.location.z) > instance.distance) {
            if (Player.isAdmin(plr) || plr.hasTag(config.bypass))
                return;
            plr.teleport({ x: 1, y: 60, z: 1 }, { dimension: world.getDimension(instance.dimension) });
            if (instance.action === 'cancel')
                return;
            if (instance.action === 'kick')
                return world.getDimension('overworld').runCommandAsync(`kick "${plr.name}" §l§cROT AC\n§r§7Reason: Crash attempt`).catch();
            if (instance.action === 'warn')
                return plr.runCommandAsync(`scoreboard players add @s warns 1`).catch();
        }
    });
}, 1);
