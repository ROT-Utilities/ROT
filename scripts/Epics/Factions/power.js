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
import { connected } from "../../Tales/playerConnect.js";
import { config, fac } from "./main.js";
import Player from "../../Papers/PlayerPaper.js";
world.events.entityDie.subscribe(res => {
    if (!(res.deadEntity instanceof IPlayer))
        return;
    const dPower = Player.getScore(res.deadEntity, config.powerObj);
    if (dPower > 0) {
        let nPower = dPower - config.powerDeath;
        if (config.maxPower && (0 > nPower))
            nPower = 0;
        res.deadEntity.runCommandAsync(`scoreboard players set @s "${config.powerObj}" ${nPower}`);
        res.deadEntity.sendMessage(`§c§l-${dPower - nPower} power`);
    }
    if (!(res.damageSource.damagingEntity instanceof IPlayer))
        return;
    const id = fac.player.read(connected[res.damageSource.damagingEntity.name].rID), sPower = Player.getScore(res.damageSource.damagingEntity, config.powerObj);
    if (id === fac.player.read(connected[res.deadEntity.name].rID))
        return Player.send(res.damageSource.damagingEntity, 'The more you kill people in your faction, the more power you\'ll lose...', 'FTN');
    if (config.maxPower && config.maxPower <= sPower)
        return;
    let nPower = sPower + config.powerKill;
    if (config.maxPower && (nPower > config.maxPower))
        nPower = config.maxPower;
    res.damageSource.damagingEntity.runCommandAsync(`scoreboard players set @s "${config.powerObj}" ${nPower}`);
    res.damageSource.damagingEntity.sendMessage(`§a§l+${nPower - sPower} power`);
    if (!id)
        return;
    const name = fac.names.find(id);
    fac.kills.write(name, fac.kills.read(name) + 1);
});
