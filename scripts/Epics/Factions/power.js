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
import { world, Player as IPlayer } from "@minecraft/server";
import Player from "../../Papers/PlayerPaper.js";
import quick from "../../quick.js";
import { connected } from "../../Tales/playerConnect.js";
import { fac } from "./main.js";
const config = quick.epics.Factions;
world.events.entityHurt.subscribe(res => {
    if (!(res.hurtEntity instanceof IPlayer) || res.hurtEntity.getComponent('health').current > 0)
        return;
    const dPower = Player.getScore(res.hurtEntity, config.powerObj);
    if (dPower > 0) {
        let nPower = dPower - config.powerDeath;
        if (config.maxPower && (0 > nPower))
            nPower = 0;
        res.hurtEntity.runCommandAsync(`scoreboard players set @s "${config.powerObj}" ${nPower}`);
        res.hurtEntity.sendMessage(`§c§l-${dPower - nPower} power`);
    }
    if (!(res.damageSource.damagingEntity instanceof IPlayer))
        return;
    const sPower = Player.getScore(res.damageSource.damagingEntity, config.powerObj);
    if (config.maxPower && config.maxPower <= sPower)
        return;
    let nPower = sPower + config.powerKill;
    if (config.maxPower && (nPower > config.maxPower))
        nPower = config.maxPower;
    res.damageSource.damagingEntity.runCommandAsync(`scoreboard players set @s "${config.powerObj}" ${nPower}`);
    res.damageSource.damagingEntity.sendMessage(`§a§l+${nPower - sPower} power`);
    if (fac.player.has(connected[res.damageSource.damagingEntity.name][2]))
        return;
    const name = fac.names.find(fac.player.read(connected[res.damageSource.damagingEntity.name][2]));
    fac.kills.write(name, fac.kills.read(name) + 1);
});
