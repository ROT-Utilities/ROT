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
import { system } from "@minecraft/server";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import Database from "../../Papers/DatabasePaper.js";
import { world } from "@minecraft/server";
import quick from "../../quick.js";
import Player from "../../Papers/PlayerPaper.js";
const cmd = Commands.create({
    name: 'lockdimension',
    aliases: ['lockdim', 'lockd'],
    category: 'Server'
});
cmd.startingArgs(['dim']);
let lockReg = null;
(async function () {
    lockReg = await Database.registry('lockDim');
})();
cmd.dynamicType('dim', ['the end', 'nether'], async (plr, val) => {
    const value = lockReg.read(val) ?? 0;
    if (!value)
        lockReg.write(val, 1);
    else
        lockReg.write(val, 0);
    plr.send(`Succesfully ${value ? 'unlocked' : 'locked'} §a${val} §edimension`);
});
system.runInterval(async () => {
    if (!lockReg)
        return;
    for (const player of world.getPlayers()) {
        if (Player.isAdmin(player) || !player?.dimension)
            continue;
        const val = lockReg.read(player.dimension.id.replace('minecraft:', ''));
        if (!val)
            continue;
        player.sendMessage(`§cThis dimension is not allowed!`);
        player.teleport(quick.dimNotAllowedLoc.loc, { dimension: world.getDimension(quick.dimNotAllowedLoc.dim) });
    }
});
