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
system.beforeEvents.watchdogTerminate.subscribe(res => res.cancel = true);
import { metricNumbers } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import { confirmForm } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { ModalForm } from "../../Papers/FormPaper.js";
import Player from '../../Papers/PlayerPaper.js';
import quick from "../../quick.js";
//Defining very much needed variables
const config = quick.epics['Money Transfer'];
import "./interval.js";
import "./command.js";
//Opening methods
if (config.npc)
    world.afterEvents.entityHitEntity.subscribe(data => {
        if (data.hitEntity?.typeId !== 'rot:mt' || data.damagingEntity.typeId !== 'minecraft:player')
            return;
        const player = Player.playerType(data.damagingEntity, { from: config.npcName, sound: false });
        if (player.isAdmin && player.isSneaking)
            return data.hitEntity.triggerEvent('rot:despawn');
        try {
            openMT(player);
        }
        catch (e) {
            console.warn(e + e.stack);
            confirmForm(player, 'Money Transfer', '§4Something went wrong while opening the form!', '§aOk', '§cTry again!');
        }
    });
//Main form / home page
export function openMT(player) {
    const form = new ModalForm(), players = world.getAllPlayers().filter(p => p.name !== player.name);
    if (!players.length)
        return player.send(`There are no players to transfer with...`, config.npcName, true);
    form.setTitle('§8§lMoney Transfer System');
    form.addDropdown(`§eYou currently have §a${player.getScore(config.obj)} ${config.currency}§r\n\nPlayer to transfer to: `, ['None', ...players.map(p => p.name)], 0);
    form.addInput(`Amount of ${config.currency} to transfer: `, 'Amount');
    form.send(player, res => {
        if (res.canceled)
            return config.comeBack && player.send('Come back soon!');
        const selection = Player.playerType(players[res.formValues[0] - 1]);
        if (!selection)
            return player.error(`You must select a player to transfer to!`, config.npcName, true);
        if (!world.getAllPlayers().some(p => p.id === selection.id))
            return player.error('The player you selected is no longer in the game.');
        if (!res.formValues[1])
            return player.error('You must enter a value to transfer to the player!', config.npcName, true);
        if (isNaN(res.formValues[1]))
            return player.error('The value you entred must be a number!', config.npcName, true);
        if (0 >= Number(res.formValues[1]))
            return player.error('No values less than 1');
        if (player.getScore(config.obj) < res.formValues[1])
            return player.error(`You need ${res.formValues[1] - player.getScore(config.obj)} more to be able to transfer that amount of money!`, config.npcName, true);
        if (res.formValues[1] > 1000000)
            return player.error('The amount to transfer cant be more than 1 Million!', config.npcName, true);
        player.runCommandAsync(`scoreboard players remove @s "${config.obj}" ${res.formValues[1]}`);
        selection.runCommandAsync(`scoreboard players add @s "${config.obj}" ${res.formValues[1]}`);
        selection.send(`§a${player.name} §eHas gaven you ${metricNumbers(res.formValues[1])} ${config.currency}.`, config.npcName, true);
        player.send('Transition successfull!', config.npcName, true);
    });
}
