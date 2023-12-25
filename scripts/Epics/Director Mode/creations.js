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
import { configure as configCMD, findCommand } from "./Commands/command.js";
import { configure as configFRM, findForm } from "./Forms/form.js";
import { ActionForm } from "../../Papers/FormPaper.js";
import { DM } from "./main.js";
export function creations(player) {
    const form = new ActionForm();
    form.setTitle('§a§lAll server creations');
    form.addButton('§aAll custom commands', 'textures/ROT/forms/Director Mode/slash.png');
    form.addButton('§eAll custom GUIs', 'textures/ROT/forms/Director Mode/ui.png');
    form.addButton('§cAll scenes\n§e(not finished)', 'textures/ROT/forms/Director Mode/cut.png');
    form.addButton('§4§lBack', 'textures/ROT/forms/Director Mode/quit.png');
    form.send(player, async (res) => {
        if (res.canceled)
            return player.send('Goodbye!');
        if (res.selection === 3)
            return DM.open(player);
        if (res.selection === 0) {
            const cmd = await findCommand(player);
            if (!cmd)
                return creations(player);
            if (cmd === true)
                return;
            return configCMD(player, cmd);
        }
        if (res.selection === 1) {
            const form = await findForm(player);
            if (!form)
                return creations(player);
            if (form === true)
                return;
            return configFRM(player, form);
        }
    });
}
