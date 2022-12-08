/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer),
notbeer (ROT's base code)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
/**
import config from '../../main.js';
import quick from '../../Papers/DatabasePaper.js';
//import { Tpa } from '../../Papers/TpaPaper.js';
import Server from '../../ServerBook.js';
const cmd = Server.command.create({
    name: 'tpa',
    description: `You can use ${quick.prefix}tpa to request to be teleported to someone, or accept someone to teleport to you`,
    aliases: ['tp'],
    category: 'Escape',
    developers: ['Aex66']
});

cmd.startingArgs(['send', 'accept', 'deny'])

cmd.staticType('send', 'send', (plr, val) => Tpa.send(plr.name, val))
cmd.staticType('accept', 'accept', (plr, val) => Tpa.accept(plr.name, val))
cmd.staticType('deny', 'decline', (plr, val) => Tpa.decline(plr.name, val))
//don't works
*/
//disabled for the moment
