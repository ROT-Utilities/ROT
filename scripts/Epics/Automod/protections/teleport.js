import { EquipmentSlot, MinecraftItemTypes, system, world } from "@minecraft/server";
import quick from "../../../quick.js";
import Player from "../../../Papers/PlayerPaper.js";
const locations = [];
const config = quick.epics.Automod, instance = config.protections.teleport;
world.afterEvents.playerSpawn.subscribe((res) => {
    if (!locations.find(l => l.plrID === res.player.id))
        return;
    locations.splice(locations.indexOf(locations.find(l => l.plrID === res.player.id)), 1);
    locations.push({ plrID: res.player.id, location: res.player.location, dim: res.player.dimension.id });
});
system.runInterval(() => {
    world.getAllPlayers().forEach((plr) => {
        if (!locations.find(l => l.plrID === plr.id))
            return locations.push({ plrID: plr.id, location: plr.location, dim: plr.dimension.id });
        const saved = locations.find(l => l.plrID === plr.id);
        locations.splice(locations.indexOf(saved), 1);
        locations.push({ plrID: plr.id, location: plr.location, dim: plr.dimension.id });
        let { x, y, z } = saved.location;
        if (saved.dim !== plr.dimension.id) {
            x = plr.location.x;
            y = plr.location.y;
            z = plr.location.z;
        }
        if (plr.hasTag(instance.skip))
            return plr.removeTag(instance.skip);
        if (plr.getComponent('equipment_inventory').getEquipment(EquipmentSlot.chest)?.type === MinecraftItemTypes.elytra)
            return;
        if ((~~(distance({ x: ~~(x), y: ~~(y), z: ~~(z) }, { x: ~~(plr.location.x), y: ~~(plr.location.y), z: ~~(plr.location.z) })) >= 20)) {
            if (Player.isAdmin(plr) || plr.hasTag(config.bypass))
                return;
            locations.splice(locations.indexOf(locations.find(l => l.plrID === plr.id), 1));
            locations.push({ plrID: plr.id, location: saved.location, dim: saved.dim });
            plr.sendMessage('§cYou are not allowed to teleport!');
            plr.teleport(saved.location, { dimension: world.getDimension(saved.dim) });
            if (instance.action === 'cancel')
                return;
            if (instance.action === 'kick')
                return world.getDimension('overworld').runCommandAsync(`kick "${plr.name}" §l§cROT AC\n§r§7Reason: Teleporting`).catch();
            if (instance.action === 'warn')
                return plr.runCommandAsync(`scoreboard players add @s warns 1`).catch();
        }
    });
}, 5);
function distance(vector1, vector2) {
    const distanciaX = Math.abs(vector1.x - vector2.x);
    const distanciaY = Math.abs(vector1.y - vector2.y);
    const distanciaZ = Math.abs(vector1.z - vector2.z);
    const distanciaTotal = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY + distanciaZ * distanciaZ);
    return distanciaTotal;
}
