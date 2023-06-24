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
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import { tps } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
const cmd = Commands.create({
    name: 'tps',
    description: 'Get server TPS',
    category: 'Server'
});
cmd.callback((plr) => {
    plr.send(`Current server TPS: ${(Number(tps.toFixed(0)) >= 15) ? '§a' : '§c'}${tps.toFixed(3)}`);
});
