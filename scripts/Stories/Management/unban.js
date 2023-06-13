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
import { ban } from "./ban.js";
const cmd = Commands.create({
    name: 'unban',
    category: 'Management'
});
cmd.startingArgs('player');
cmd.playerType('player', (plr, val) => {
    const date = ban.regExpire.find(Number(val.rID));
    const reason = ban.regReason.find(Number(val.rID));
    if (!date)
        return plr.error(`§a${val.name}§e is not banned`);
    plr.send(`§a${val.name}§e is now unbanned!`);
    ban.regExpire.delete(date);
    ban.regReason.delete(reason);
    console.warn(`Player §c${val.name}§r with ID §c${val.rID}§r got unbanned!`);
}, false, undefined, { self: false });
