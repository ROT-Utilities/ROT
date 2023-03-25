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
import { world } from "@minecraft/server";
import { clientBids, clientPosts, bidPING, clientCollect, collectPING } from "./client.js";
import { numberToHex } from "../../Papers/paragraphs/ConvertersParagraphs.js";
import { ActionForm, MessageForm } from "../../Papers/FormPaper.js";
import { managementForm } from "./manage.js";
import { serverPosts } from "./server.js";
import Database from '../../Papers/DatabasePaper.js';
import Player from '../../Papers/PlayerPaper.js';
import quick from "../../quick.js";
//Add a next page to the AH or a show limiter
//Add a profile page
//Add a search button 
//Add a way to buyout auctions
export const AH = {
    config: quick.epics['Auction House'],
    AHR: Database.registry('AHreturn'),
    AHP: Database.register('playerPosts', 'AH'),
    AHB: Database.register('playerBids', 'AH'),
    AHC: Database.register('playerCollect', 'AH'),
    AHS: Database.register('playerSold', 'AH'),
    //Main form / home page
    openAH(player) {
        player.removeTag(AH.config.tag);
        player.runCommandAsync(`scoreboard players add @s "${AH.config.obj}" ${AH.AHR.read(player.rID)}`);
        AH.AHR.delete(player.rID);
        const choose = new ActionForm();
        choose.setTitle('§8§lAuction House§r');
        choose.setBody('§7Welcome to Black Hat Matt\'s auction house!§r');
        choose.addButton('All auctions', 'textures/rot/forms/serverAuctions.png');
        choose.addButton('Your auctions', 'textures/rot/forms/clientAuctions.png');
        choose.addButton('Your bids', `textures/rot/forms/bid${bidPING(player) ? 'PING' : ''}.png`);
        choose.addButton('Collect items & money', `textures/rot/forms/win${collectPING(player) ? 'PING' : ''}.png`);
        player.isAdmin && choose.addButton('§cDev menu§r', 'textures/rot/forms/dev.png');
        choose.addButton('§4§lClose§r', 'textures/rot/forms/leave.png');
        choose.send(player, res => {
            if (res.selection === 0)
                return serverPosts(player, AH.openAH);
            if (res.selection === 1)
                return clientPosts(player, AH.openAH);
            if (res.selection === 2)
                return clientBids(player, AH.openAH);
            if (res.selection === 3)
                return clientCollect(player);
            if ((res.selection === 4 && !player.isAdmin) || res.selection === 5 || res.canceled)
                return AH.config.comeBack && player.send('Come back soon!');
            managementForm(player);
        });
    },
    /**
     * Converts auction data to post data
     * @param {string} date The date/ID of the post
     * @returns {postData} postData
     */
    getPost(date) {
        if (!Database.has(date, 'AHP'))
            return;
        const data = Database.register(date, 'AHP').getCollection(), bidData = data?.b ?? {}, bidKeys = Object.keys(bidData).reverse();
        return {
            name: data?.n ?? data.i,
            itemName: data.i,
            amount: data.a,
            price: bidData?.[bidKeys[0]]?.[1] ?? data.p,
            startPrice: data.p,
            time: data.t,
            creator: { id: data.c[0], name: data.c[1], silent: Boolean(data.c[2]) },
            bidData: data?.b ?? {},
            bidID: bidKeys,
            bidName: bidKeys.map(n => bidData[n][0]),
            bidSilent: bidKeys.map(s => Boolean(bidData[s][2])),
            bids: bidKeys.map(n => bidData[n][1]),
            removedIDs: data?.r ?? [],
            enchants: data.e
        };
    },
    verifyPost(date, data) {
        if (!Database.has(date, 'AHP'))
            return;
        const many = Database.register(date, 'AHP').readMany(['i', 'b']);
        if (many[0] !== data.itemName)
            return;
        if (Object.values(many[1] ?? {})?.reverse()?.[0]?.[1] !== data.bids[0])
            return;
        return true;
    },
    /**
     * Updates date for a existing or non existing post
     * @param {string} date The date/ID of the post
     * @param {writeData} data The updated data to be written
     */
    updatePost(date, data) {
        const db = Database.register(date, 'AHP'), update = {};
        if (data.hasOwnProperty('name') && (data.name !== data.itemName && data.name !== db.read('i')))
            Object.assign(update, { n: data.name });
        if (data.hasOwnProperty('itemName'))
            Object.assign(update, { i: data.itemName });
        if (data.hasOwnProperty('amount'))
            Object.assign(update, { a: data.amount });
        if (data.hasOwnProperty('bidData'))
            Object.assign(update, { b: data.bidData });
        if (data.hasOwnProperty('startPrice'))
            Object.assign(update, { p: data.startPrice });
        if (data.hasOwnProperty('time'))
            Object.assign(update, { t: data.time });
        if (data.hasOwnProperty('creator'))
            Object.assign(update, { c: [data.creator[0], data.creator[1], data.creator[2] ? 1 : 0] });
        if (data.hasOwnProperty('removedIDs'))
            Object.assign(update, { r: data.removedIDs });
        if (data.hasOwnProperty('enchants'))
            Object.assign(update, { e: data.enchants });
        db.writeMany(update);
    },
    /**
     * Creates a auction post
     * @param {PlayerType} player The player
     * @param {ItemData} item The item being put up for auction
     * @param {writeData} data Additional data
     */
    publishPost(player, item, data) {
        const date = numberToHex(new Date().getTime() + (data.time * 3.6e+6)), ahp = AH.AHP.read(player.rID) || [];
        AH.updatePost(date, {
            name: data.name,
            itemName: data.itemName,
            amount: item.amount,
            time: data.time,
            startPrice: data.price,
            creator: [player.rID, player.name, data.silent],
            enchants: item?.enchantments?.map(e => [e.id, e.level]) ?? []
        });
        ahp.push(date);
        AH.AHP.write(player.rID, ahp);
        Database.register(date, 'AHI').write('', item);
        return date;
    },
    /**
     * Creates a error screen displaying a error to the player
     * @param {PlayerType} player The player
     * @param {Function} from Where is the error from
     * @param {string} error The error. What happened?
     * @returns {void}
     */
    errorForm(player, from, error) {
        const err = new MessageForm();
        err.setTitle('§4§lOops!§r');
        err.setBody(`§4${error ? error : 'Oops!§c A error occurred and we are usable to parse formData'}. §r§4Please try again or come back later.\n\nIf you are seeing error again please report it to a Administrator. Thank you!§r`);
        err.setButton1('§e§lTry again§r');
        err.setButton2('§4§lClose§r');
        err.send(player, res => res.selection && from(player, AH.openAH));
    }
};
//Opening methods
if (AH.config.npc)
    world.events.entityHit.subscribe(data => {
        if (data.hitEntity?.typeId !== 'rot:ah' || data.entity.typeId !== 'minecraft:player')
            return;
        const player = Player.playerType(data.entity, { from: AH.config.npcName, sound: false });
        try {
            AH.openAH(player);
        }
        catch (e) {
            console.warn(e + e.stack);
            AH.errorForm(player, AH.openAH);
        }
    });
import('./interval.js');
