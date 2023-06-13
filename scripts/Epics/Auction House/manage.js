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
import { ActionForm, MessageForm } from "../../Papers/FormPaper.js";
import { MS, numberToHex } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import { confirmForm } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { AH } from "./main.js";
import Database from "../../Papers/DatabasePaper.js";
import Player from "../../Papers/PlayerPaper.js";
export function managementForm(player) {
    if (!player.isAdmin)
        return AH.errorForm(player, managementForm, 'Player does not access to this form');
    const dev = new ActionForm();
    dev.setTitle('§c§lManagement Page§r');
    dev.setBody('§c§cWelcome to the management page!§r');
    dev.addButton('§c§lReturn all items§r', 'textures/ROT/forms/Auction House/block.png');
    dev.addButton('§e§lEnd all auctions§r', 'textures/ROT/forms/Auction House/ultra.png');
    dev.addButton('§8§lDelete all auctions§r', 'textures/ROT/forms/Auction House/garbage.png');
    dev.addButton('§c§lBack§r', 'textures/ROT/forms/Auction House/leave.png');
    dev.send(player, async (res) => {
        if (res.selection === 3 || res.canceled)
            return AH.openAH(player);
        if (!(await confirmForm(player, '§4§lAre you sure?§r', '§cAre you sure you want to preform this action?§r', '§c§lI am sure!§r', '§2§lCancel!§r')))
            return AH.openAH(player);
        //Return all items and money screen and code
        if (res.selection === 0) {
            for (const p of Database.allTables('AHP')) {
                const post = await AH.getPost(p), id = numberToHex(new Date().getTime() + (AH.config.maxHoldTime * 3.6e+6));
                ;
                if (!post)
                    continue;
                const db = await Database.register(id, 'AHC');
                if (post.name !== post.itemName)
                    db.write('n', post.name);
                db.writeMany({
                    i: post.itemName,
                    d: p,
                    a: post.amount,
                    p: post.startPrice,
                    c: [post.creator.id, post.creator.name, post.creator.silent ? 1 : 0]
                });
                AH.client.update(player.rID, 'AHC', 'add', id);
                Database.drop(p, 'AHP');
                const lastBidder = Player.getBy({ id: post.bidID[0] }, { from: AH.config.npcName });
                if (lastBidder)
                    lastBidder.runCommandAsync(`scoreboard players add @s "${AH.config.obj}" ${post.bids[0]}`);
                else if (post.bidID[0])
                    AH.client.AHR.write(post.bidID[0], (AH.client.AHR.read(post.bidID[0]) || 0) + post.bids[0]);
            }
            const success = new MessageForm();
            success.setTitle('§4§lCongratulations :)!§r');
            success.setBody(`§l§cSuccess!§r All of the auction items and money have been requested to be returned. Remember, if they do not collect their item in §c${MS(AH.config.maxHoldTime * 3.6e+6)} hours§r, or if they do not accept the item, they will §4NOT§r get it back!`);
            success.setButton1('Ok!');
            success.setButton2('§c§lClose§r');
            return success.send(player, res => res.selection && AH.openAH(player));
        }
        //End all auctions
        if (res.selection === 1) {
            for (const p of Database.allTables('AHP')) {
                const post = await AH.getPost(p), id = numberToHex(new Date().getTime() + (AH.config.maxHoldTime * 3.6e+6));
                if (!post)
                    continue;
                const db = await Database.register(id, 'AHC'), target = post.bidID[0] ? post.bidID[0] : post.creator.id;
                if (post.name !== post.itemName)
                    db.write('n', post.name);
                if (post.bidID[0])
                    db.write('w', [post.bidID[0], post.bids[0]]);
                db.writeMany({
                    i: post.itemName,
                    d: p,
                    a: post.amount,
                    p: post.startPrice,
                    c: [post.creator.id, post.creator.name, post.creator.silent ? 1 : 0]
                });
                AH.client.update(target, 'AHC', 'add', id);
                Database.drop(p, 'AHP');
            }
            const success = new MessageForm();
            success.setTitle('§e§lCongratulations :)!§r');
            success.setBody('§l§aSuccess!§r All of the auctions have been completed.');
            success.setButton1('Ok!');
            success.setButton2('§c§lClose§r');
            return success.send(player, res => res.selection && AH.openAH(player));
        }
        //Delete all auctions
        AH.reg.AHP[1].clear();
        AH.reg.AHB[1].clear();
        AH.reg.AHC[1].clear();
        AH.reg.AHS[1].clear();
        Database.allTables('AHI').forEach(i => Database.drop(i, 'AHI'));
        Database.allTables('AHP').forEach(i => Database.drop(i, 'AHP'));
        Database.allTables('AHC').forEach(i => Database.drop(i, 'AHC'));
        const success = new MessageForm();
        success.setTitle('§4§lCongratulations ;(!§r');
        success.setBody('§l§cSuccess!§r All of the auctions have been deleted, and money has been returned.');
        success.setButton1('Ok!');
        success.setButton2('§c§lClose§r');
        return success.send(player, res => res.selection && AH.openAH(player));
    });
}
;
