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
import { world } from '@minecraft/server';
import quick from '../main.js';
import Commands from '../Papers/CommandPaper/CommandPaper.js';
import Database from '../Papers/DatabasePaper.js';
import Lang from '../Papers/LangPaper.js';
import Player from '../Papers/PlayerPaper.js';
/**
 * The rank system and the command starter/runner
 */
const db = Database.register('server');
world.events.beforeChat.subscribe(data => {
    data.message = data.message.replaceAll('  ', ' ');
    data.cancel = true;
    if (!data.message.startsWith(quick.prefix)) {
        const player = Player.playerType(data.sender, { from: 'CHAT' }), time = new Date();
        if (data.message.startsWith(quick.prefix))
            return player.error(Lang.cmd.wrongPrefix);
        if (data.sender.hasTag('mute'))
            return player.error(Lang.chat.mutted);
        if (data.message.trim() === '')
            return;
        if (!db.has('setup'))
            return data.cancel = false;
        const message = data.message.charAt(0).toUpperCase() + data.message.slice(1), rank = `§7[${player.getPrefixes().join('§r§7, ')}§r§7] ${player.getNameColor()}`;
        let currentHour = time.getUTCHours(), AMPM = '';
        if (currentHour < 0)
            currentHour = currentHour + 24;
        if (currentHour <= 12)
            AMPM = currentHour === 12 ? 'PM' : 'AM', currentHour === 0 ? currentHour = 12 : null;
        else
            currentHour = currentHour - 12, AMPM = 'PM';
        return Array.from(world.getPlayers()).forEach(plr => plr.tell(`${rank}§r§7 ${currentHour}:${time.getUTCMinutes() < 10 ? '0' + time.getUTCMinutes() : time.getUTCMinutes()} ${AMPM}: §f${message}§r`));
    }
    const args = data.message.slice(quick.prefix.length).trim().split(/\s+/), command = args.shift().toLowerCase(), cmd = Commands.list.find(cmd => cmd.name === command || cmd.aliases && cmd.aliases.includes(command));
    Commands.run(cmd, Player.playerType(data.sender, { from: cmd?.name ?? 'ROT' }), args);
});
