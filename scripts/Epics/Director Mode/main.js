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
import { world, Player as IPlayer, system } from "@minecraft/server";
import { create as createCMD } from "./Commands/command.js";
import { ActionForm } from "../../Papers/FormPaper.js";
import { create as createFRM } from "./Forms/form.js";
import { creations } from "./creations.js";
import Database from "../../Papers/DatabasePaper.js";
import Player from "../../Papers/PlayerPaper.js";
import quick from "../../quick.js";
export const DM = {
    config: quick.epics['Director Mode'],
    open(player) {
        player;
        system.run(() => {
            const form = new ActionForm();
            form.setTitle('§d§lDirector Mode');
            form.setBody('Welcome to Director mode! What do you want to do?');
            form.addButton('§9Create a Command', 'textures/ROT/forms/Director Mode/slash.png');
            form.addButton('§aCreate a GUI', 'textures/ROT/forms/Director Mode/ui.png');
            form.addButton('§cCreate a scene\n§e(not finished)', 'textures/ROT/forms/Director Mode/cut.png');
            form.addButton('§bView server creations', 'textures/ROT/forms/Director Mode/files.png');
            form.addButton('§cExit', 'textures/ROT/forms/Director Mode/quit.png');
            form.send(player, res => {
                if (res.canceled)
                    return player.send('Goodbye!');
                if (res.selection === 0)
                    return createCMD(player);
                if (res.selection === 1)
                    return createFRM(player);
                if (res.selection === 3)
                    return creations(player);
            });
        });
    },
    cmd: {
        reg: null,
        base: null,
        regData: null
    },
    form: {
        reg: null,
        regBTNs: null,
        regData: null,
        forms: {}
    }
};
(async function () {
    //Commands
    DM.cmd.reg = await Database.registry('DM:cmds');
    DM.cmd.base = await Database.registry('DM:cmds_base');
    DM.cmd.regData = await Database.registry('DM:cmds_Data');
    //Forms
    DM.form.reg = await Database.registry('DM:form');
    DM.form.regBTNs = await Database.registry('DM:formBTNs');
})();
world.afterEvents.itemUse.subscribe(data => {
    if (!(data.source instanceof IPlayer))
        return;
    if (data.itemStack.typeId !== 'rot:director' || !Player.isAdmin(data.source))
        return;
    DM.open(Player.playerType(data.source, { from: 'DTR', sound: false }));
});
import('./interval.js');
if (DM.config.Actors.enabled)
    import('./Actors/main.js');
//Make a form like reaction roles
