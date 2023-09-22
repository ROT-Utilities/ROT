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
import { connected } from "../../Tales/playerConnect";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import Server from "../../Papers/ServerPaper.js";
import Player from "../../Papers/PlayerPaper.js";
if (!Server.db.has('afkTime'))
    Server.db.write('afkTime', 120);
const afk = {};
const cmd = Commands.create({
    name: 'afk',
    description: 'A simple afk system.',
    category: 'Management',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['toggle', 'time'], false);
cmd.callback((player, args) => {
    if (args.length)
        return;
    player.send(`Current settings:\nSystem is ${Server.db.read('afkToggle') ? '§aON' : '§cOFF'}§e\nTime is set to: §6${Server.db.read('afkTime')} seconds`);
});
cmd.booleanType('toggle', (player, value) => {
    Server.db.write('afkToggle', Number(value));
    player.send(`The AFK system has been turned ${value ? '§aON' : '§cOFF'}§e!`);
});
cmd.numberType('time', (player, value) => {
    Server.db.write('afkTime', value);
    player.send(`The AFK system's time has been set to §6${Server.db.read('afkTime')} seconds§e!`);
}, [], { float: false, min: 1, max: 10000 });
system.runInterval(() => Server.db.read('afkToggle') && world.getAllPlayers().forEach(player => {
    if (!connected.hasOwnProperty(player.name) || Player.isAdmin(player))
        return;
    if (!afk.hasOwnProperty(player.name))
        afk[player.name] = [{}, 0];
    if (JSON.stringify(afk[player.name][0]) !== JSON.stringify(player.location)) {
        afk[player.name][1] = Date.now() + (Server.db.read('afkTime') * 1000);
        afk[player.name][0] = player.location;
    }
    if (afk[player.name][1] !== 0 && afk[player.name][1] < Date.now()) {
        delete afk[player.name];
        Server.runCommand(`kick "${player.name}" §c§lYou have been inactive too long!`);
    }
}), 20);
