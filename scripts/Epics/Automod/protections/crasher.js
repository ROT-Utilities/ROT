import { system, world } from "@minecraft/server";
import Player from "../../../Papers/PlayerPaper.js";
import quick from "../../../quick.js";
const config = quick.epics.Automod;
const automod = quick.automod;
system.runInterval(() => {
    world.getAllPlayers().forEach((plr) => {
        if (~~(plr.location.x) > config.crasher ||
            ~~(plr.location.y) > config.crasher ||
            ~~(plr.location.z) > config.crasher) {
            if (Player.isAdmin(plr) || plr.hasTag(config.bypass))
                return;
            //takeAction(plr, 'Crasher', automod.crasher, null, 'Attempt to crash the server', 'ROT AC')
            if (automod.crasher === 'block')
                plr.teleport({ x: 1, y: 60, z: 1 }, world.getDimension('overworld'), plr.getRotation().x, plr.getRotation().y);
        }
    });
}, 1);
