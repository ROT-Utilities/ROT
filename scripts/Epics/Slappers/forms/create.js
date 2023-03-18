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
import { ModalForm } from "../../../Papers/FormPaper.js";
import { createSlapper } from "../createSlapper.js";
export const create = (player) => {
    const form = new ModalForm();
    form.setTitle('Create Slapper');
    form.addInput('Entity id', 'minecraft:villager');
    form.addInput('Slapper Name', 'Slapper Name', 'Slapper');
    form.addInput('Command', 'command', 'say hey');
    form.send(player, (res) => {
        if (res.canceled)
            return;
        const [entityId, name, command] = res.formValues;
        const { x, y, z } = player.location;
        if (!entityId)
            return create(player);
        createSlapper(entityId, { x, y, z }, player.dimension.id, command, name);
        return player.send('Slapper created', 'Slappers');
    });
};
