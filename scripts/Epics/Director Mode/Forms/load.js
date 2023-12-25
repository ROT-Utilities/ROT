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
import { sleep } from "../../../Papers/Paragraphs/ExtrasParagraphs.js";
import { DM } from "../main.js";
import quick from "../../../quick.js";
let loaded = [];
system.runInterval(() => {
    if (system.currentTick < 20)
        return;
    const keys = DM.form.reg.allKeys();
    if (JSON.stringify(keys) === JSON.stringify(loaded))
        return;
    loaded = keys;
    load();
}, 20);
async function load() {
    await sleep(20);
    DM.form.forms = {};
    Object.entries(DM.form.reg.getCollection()).forEach(form => {
        try {
            const key = form[1], data = JSON.parse(form[0].split('&-&')[1].replace(/\$-\$/g, '"')), buttons = JSON.parse(DM.form.regBTNs.find(key).split('&-&')[1].replace(/\$-\$/g, '"'));
            DM.form.forms[`${key}`] = {
                id: `${key}`,
                name: data[0],
                type: data[5],
                body: data[1],
                tag: data[2],
                item: data[3],
                base: data[4],
                creator: data[6],
                buttons,
            };
        }
        catch (e) {
            console.warn(e + e.stack);
            quick.logs.errors.push(e + e.stack);
        }
    });
}
