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
import { ActionForm, MessageForm, ModalForm } from "../../Papers/FormPaper.js";
import { hexToNumber, numberToHex } from "../../Papers/paragraphs/ConvertersParagraphs";
import { confirmForm, errorForm, getPost, openAH, publishPost, updatePost, verifyPost } from "./main.js";
import { checkPosts } from "./interval.js";
import { openPost } from "./open.js";
import { clientCollect } from "./client.js";
import Server from "../../Papers/ServerPaper.js";
import quick from "../../main.js";
import Database from "../../Papers/DatabasePaper.js";
import Player from "../../Papers/PlayerPaper.js";
//Defining very much needed variables
const config = quick.epics['Auction House'];
export function editPost(player, date, from) {
    const dev = new ActionForm();
    dev.setTitle('§c§lEdit Menu§r');
    dev.addButton('§7§lEdit auction§r', 'textures/rot/forms/change2.png');
    dev.addButton('§c§lReturn item§r', 'textures/rot/forms/block.png');
    dev.addButton('§e§lEnd auction now§r', 'textures/rot/forms/ultra.png');
    dev.addButton('§c§lDelete auction§r', 'textures/rot/forms/garbage.png');
    dev.addButton('§c§lBack§r', 'textures/rot/forms/leave.png');
    dev.send(player, async (res) => {
        if (res.selection === 4 || res.canceled)
            return openPost(player, date, from);
        if (hexToNumber(date) - new Date().getTime() <= 0)
            checkPosts();
        const post = getPost(date);
        if (!post)
            return errorForm(player, from);
        if (post.creator.id !== player.id && !player.isAdmin)
            return errorForm(player, from, 'Unable to verify that you have permission to edit this post');
        if (!verifyPost(date, post))
            return errorForm(player, from);
        //Edit auction - Admin screen
        if (res.selection === 0) {
            const edit = new ModalForm(), time = config.maxPostTime - post.time;
            edit.setTitle(`§l§8Edit §a${post.name.length > 10 ? post.name.slice(0, 10) + '...' : post.name}§r`);
            edit.addInput('Display name (Max 15 chars)', post.name, post.name);
            if (config.boxNumber)
                edit.addInput('Starting bid', `${post.startPrice}`, `${post.startPrice}`);
            else
                edit.addSlider('Starting bid', config.postAmount[1], config.postAmount[1], config.sliderStep, post.startPrice);
            edit.addSlider('Add __ hours', 0, time, 1, 0);
            edit.addToggle('Silent auction? (hide name)', post.creator.silent);
            return edit.send(player, async (res) => {
                if (res.canceled)
                    return openPost(player, date, from);
                if (!verifyPost(date, post))
                    return errorForm(player, from);
                if (!(await confirmForm(player, `§a§lYou sure?§r`, `§cAre you sure you want to forever modify this auction?§r`, '§c§lYa!§r', '§2§lNahh!§r')))
                    return openPost(player, date, from);
                const startPrice = Number(res.formValues[1]), update = {};
                //Checks if money is NaN
                if (res.formValues[1].replace(/\d/g, '') !== '' || isNaN(startPrice))
                    return await confirmForm(player, '§5Not a number§r', `"§5${res.formValues[2]}§r" is not a number. Would you like to try again?`) ? openPost(player, date, from) : from(player, openAH);
                //Checks if the amount is vaild
                if (startPrice < config.postAmount[0] || startPrice > config.postAmount[1])
                    return await confirmForm(player, '§5Size matters?§r', `"§5${res.formValues[2]}§r" is either too small or too big! Choose a number between §6${config.postAmount[0]}-${config.postAmount[1]}§r`) ? openPost(player, date, from) : from(player, openAH);
                //Checks new item name
                if (post.name !== res.formValues[0]) {
                    if (res.formValues[0].replace(/[a-zA-Z0-9'+& ]/g, '') !== '')
                        return player.send('§c§lError §7-§r No special symbols, words, or characters in the item name please!');
                    if (res.formValues[0].length > 15)
                        return player.send('§c§lError §7-§r The auction display name is too long!');
                    Object.assign(update, { name: res.formValues[0] });
                }
                //Checks starting bid
                if (startPrice !== post.startPrice) {
                    if (startPrice > post.bids[0]) {
                        const lastBidder = Player.getByID(post.bidID[0], { from: config.npcName });
                        if (lastBidder) {
                            lastBidder.send(`The owner of the auction "§l§6${post.name}§r§e" has changed the starting bid of their auction so your bid has been returned.§r`);
                            Server.queueCommand(`scoreboard players add "${lastBidder.nameTag}" "${config.obj}" ${post.bids[0]}`);
                        }
                        else if (post.bidID[0]) {
                            const oldBid = Database.register(post.bidID[0], 'PLR');
                            oldBid.write('AHR', (oldBid.read('AHR') || 0) + post.bids[0]);
                        }
                        Object.assign(update, { bidData: {} });
                    }
                    Object.assign(update, { startPrice: startPrice });
                }
                if (res.formValues[3] !== post.creator.silent)
                    Object.assign(update, { silent: res.formValues[3] });
                if (res.formValues[2] === 0) {
                    console.warn(Object.keys(update));
                    if (!Object.keys(update).length)
                        return player.send('§c§lError §e- Nothing has changed!§r');
                    await updatePost(date, update);
                    return openPost(player, date, from);
                }
                const item = Database.register(date, 'AHI').read('');
                Database.drop(date, 'AHP');
                Database.drop(date, 'AHI');
                const newDate = await publishPost(player, item, {
                    name: res.formValues[0],
                    itemName: post.itemName,
                    price: startPrice,
                    silent: Boolean(res.formValues[3]),
                    time: post.time + parseInt(res.formValues[2])
                });
                await updatePost(newDate, {
                    bidData: update.hasOwnProperty('bidData') ? update.bidData : post.bidData,
                    removedIDs: post.removedIDs
                });
                openAH(player);
            });
        }
        if (!(await confirmForm(player, '§4§lAre you sure?§r', '§cAre you sure you want to preform this action?§r', '§c§lI am sure!§r', '§2§lCancel!§r')))
            return openPost(player, date, from);
        //Return item
        if (res.selection === 1) {
            const id = numberToHex(new Date().getTime() + (config.maxHoldTime * 3.6e+6)), success = new MessageForm(), db = Database.register(id, 'AHC');
            if (post.name !== post.itemName)
                db.write('n', post.name);
            db.writeMany({
                i: post.itemName,
                d: date,
                a: post.amount,
                p: post.startPrice,
                c: [post.creator.id, post.creator.nameTag, post.creator.silent ? 1 : 0]
            });
            player.write('AHC', [player.has('AHC') ? player.read('AHC') : [], id].flat());
            Database.drop(date, 'AHP');
            const lastBidder = Player.getByID(post.bidID[0], { from: config.npcName });
            if (lastBidder)
                Server.queueCommand(`scoreboard players add "${lastBidder.nameTag}" "${config.obj}" ${post.bids[0]}`);
            else if (post.bidID[0]) {
                const oldBid = Database.register(post.bidID[0], 'PLR');
                oldBid.write('AHR', (oldBid.read('AHR') || 0) + post.bids[0]);
            }
            success.setTitle('§a§lCongratulations :)!§r');
            success.setBody(`§l§aSuccess!§r This item will be returned.`);
            success.setButton1('§aOk!§r');
            success.setButton2('§c§lClose§r');
            return success.send(player, res => res.selection && post.creator.id === player.id ? clientCollect(player) : from(player, openAH));
        }
        //End auction now
        if (res.selection === 2) {
            const id = numberToHex(new Date().getTime() + (config.maxHoldTime * 3.6e+6)), db = Database.register(id, 'AHC');
            if (post.name !== post.itemName)
                db.write('n', post.name);
            if (post.bidID[0])
                db.write('w', [post.bidID[0], post.bids[0]]);
            db.writeMany({
                i: post.itemName,
                d: date,
                a: post.amount,
                p: post.startPrice,
                c: [post.creator.id, post.creator.nameTag, post.creator.silent ? 1 : 0]
            });
            const bidDB = Database.register(post.bidID[0] ? post.bidID[0] : post.creator.id, 'PLR');
            bidDB.write('AHC', [bidDB.has('AHC') ? bidDB.read('AHC') : [], id].flat());
            Database.drop(date, 'AHP');
            const success = new MessageForm();
            success.setTitle('§4§lCongratulations :)!§r');
            success.setBody(`§l§cSuccess!§r The auction has ended.`);
            success.setButton1('§aOk!§r');
            success.setButton2('§c§lClose§r');
            return success.send(player, res => res.selection && from(player, openAH));
        }
        Database.drop(date, 'AHP');
        Database.drop(date, 'AHI');
        const success = new MessageForm();
        success.setTitle('§4§lCongratulations ;(!§r');
        success.setBody(`§l§cSuccess!§r The §c${post.name}§r auction has been yeeted and deleted!`);
        success.setButton1('§aOk!§r');
        success.setButton2('§c§lClose§r');
        return success.send(player, res => res.selection && from(player, openAH));
    });
}
