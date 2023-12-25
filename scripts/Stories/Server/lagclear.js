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
import { system, world } from "@minecraft/server";
import { sleep } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import Server from "../../Papers/ServerPaper.js";
import quick from "../../quick.js";
let time = 0;
if (!Server.db.has('clear-time'))
    Server.db.write('clear-time', 0);
if (!Server.db.has('clear-prot'))
    Server.db.write('clear-prot', [
        'minecraft:player',
        'minecraft:wolf',
        'minecraft:cat',
        'minecraft:armor_stand',
        'minecraft:npc',
        'rot:actor',
        'rot:ah',
        'rot:client',
        'rot:hologram',
        'rot:mt',
        'rot:shop'
    ]);
const cmd = Commands.create({
    name: 'lagclear',
    description: 'The clear lag command',
    aliases: ['lagc', 'clear', 'kille', 'killentities'],
    category: 'Server',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['clear', 'protect', 'time']);
cmd.dynamicType('clear', ['clear', 'kill'], player => {
    let amount = 0;
    for (const dim in ['overworld', 'nether', 'the end'])
        for (const entity of Array.from(world.getDimension(dim).getEntities({ excludeTypes: Server.db.read('clear-prot') }))) {
            amount = amount + 1;
            entity.kill();
        }
    player.send(`Killed §a${amount}§e entities. See the ROT logs for more information.`);
});
cmd.dynamicType('protect', ['protect', 'protection', 'prot'], null, ['add', 'list', 'remove']);
cmd.staticType('add', 'add', (player, val) => {
    const prot = Server.db.read('clear-prot') ?? [];
    if (prot.includes(val))
        return player.error(`"${val}" is already a protected entity. You can do '!lagc protection' to `);
});
cmd.staticType('list', 'list', player => {
});
cmd.staticType('remove', 'remove', player => {
});
cmd.dynamicType('time', ['time', 'length', 'amount'], null, 'number');
cmd.numberType('number', (player, val) => {
    time = 0;
    Server.db.write('clear-time', val * 60);
    player.send(`The clear lag time has been set to §6${val}§e minutes`);
});
system.runInterval(async () => {
    const $time = Server.db.read('clear-time');
    if ($time === 0)
        return;
    if (time < $time)
        return time = time + 1;
    time = 0;
    world.sendMessage(quick.lagClearMessages[0]);
    await sleep(20);
    world.sendMessage(quick.lagClearMessages[1]);
    await sleep(20);
    world.sendMessage(quick.lagClearMessages[2]);
    await sleep(20);
    world.sendMessage(quick.lagClearMessages[3]);
    await sleep(20);
    world.sendMessage(quick.lagClearMessages[4]);
    await sleep(20);
    let amount = 0;
    for (const dim in ['overworld', 'nether', 'the end'])
        for (const entity of Array.from(world.getDimension(dim).getEntities({ excludeTypes: Server.db.read('clear-prot') }))) {
            amount = amount + 1;
            entity.kill();
        }
    world.sendMessage(quick.lagClearMessages[5].replace(/\$amount/, `${amount}`));
}, 20);
//Finish quick command, and chat logs, and command GUI
