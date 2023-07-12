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
import { world } from "@minecraft/server";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import Database from "../../Papers/DatabasePaper.js";
import quick from "../../quick.js";
let home = null;
(async function () {
    home = await Database.registry('homes');
})();
const cmd = Commands.create({
    name: 'home',
    description: 'Set a home and teleport to it',
    category: 'Fantasy',
});
cmd.startingArgs(['set', 'remove', 'tp']);
cmd.staticType('set', 'set', (plr, homeName) => {
    if (homeName.includes('$-$'))
        return plr.error('You cannot use the characters "$-$" in your home\'s name.');
    const pHomes = home.findMany(Number(plr.rID));
    if (pHomes.length >= quick.maxHomes)
        return plr.error('You reached the max home limit: ' + quick.maxHomes);
    if (pHomes.length && pHomes.some(x => x.split('$-$')[0] === homeName))
        return plr.error('You already have a home with that name!');
    if (!quick.homeDims.includes(plr.dimension.id))
        return plr.error('You cannot have a home in this dimension!');
    home.write(`${homeName}$-$${~~(plr.location.x)}$-$${~~(plr.location.y)}$-$${~~(plr.location.z)}$-$${plr.dimension.id}$-$${plr.rID}`, Number(plr.rID));
    plr.send(`You have successfully created §a${homeName}§e home at ${~~(plr.location.x)} ${~~(plr.location.y)} ${~~(plr.location.z)}`);
});
cmd.staticType('remove', 'remove', (plr, homeName) => {
    const pHomes = home.findMany(Number(plr.rID));
    if (!pHomes.length)
        return plr.error('You dont even have homes?');
    const val = pHomes.find(x => x.split('$-$')[0] === homeName);
    if (!val)
        return plr.error('You dont have a home with that name!');
    home.delete(val);
    plr.send(`You have successfully deleted your home §a${homeName}`);
});
cmd.staticType('tp', 'teleport', (plr, homeName) => {
    const pHomes = home.findMany(Number(plr.rID));
    if (!pHomes.length)
        return plr.error('You dont even have homes?');
    const val = pHomes.find(x => x.split('$-$')[0] === homeName);
    if (!val)
        return plr.error('You dont have a home with that name!');
    const sp = val.split('$-$');
    const x = Number(sp[1]), y = Number(sp[2]), z = Number(sp[3]), d = sp[4];
    plr.addTag(quick.epics['Automod'].protections.teleport.skip);
    plr.teleport({ x, y, z }, { dimension: world.getDimension(d), rotation: { x: plr.getRotation().x, y: plr.getRotation().y } });
    plr.send(`You have successfully teleported to your home §a${homeName}`);
});
