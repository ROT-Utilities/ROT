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
import { clientBids, clientPosts, bidPING, clientCollect, collectPING } from "./client.js";
import { numberToHex } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import { sleep } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { ActionForm, MessageForm } from "../../Papers/FormPaper.js";
import { managementForm } from "./manage.js";
import { serverPosts } from "./server.js";
import Database from '../../Papers/DatabasePaper.js';
import Player from '../../Papers/PlayerPaper.js';
import quick from "../../quick.js";
//Add a next page to the AH or a show limiter
//Add a search button 
//Add a way to buyout auctions
export const AH = {
    config: quick.epics['Auction House'],
    //Main form / home page
    openAH(player) {
        player.runCommandAsync(`scoreboard players add @s "${AH.config.obj}" ${AH.client.AHR.read(player.rID) ?? 0}`);
        AH.client.AHR.delete(player.rID);
        const choose = new ActionForm();
        choose.setTitle('§8§lAuction House§r');
        choose.setBody('§7Welcome to Black Hat Matt\'s auction house!§r');
        choose.addButton('All auctions', 'textures/ROT/forms/Auction House/serverAuctions.png');
        choose.addButton('Your auctions', 'textures/ROT/forms/Auction House/clientAuctions.png');
        choose.addButton('Your bids', `textures/ROT/forms/Auction House/bid${bidPING(player) ? 'PING' : ''}.png`);
        choose.addButton('Collect items & money', `textures/ROT/forms/Auction House/win${collectPING(player) ? 'PING' : ''}.png`);
        player.isAdmin && choose.addButton('§cDev menu§r', 'textures/ROT/forms/Auction House/dev.png');
        choose.addButton('§4§lClose§r', 'textures/ROT/forms/Auction House/leave.png');
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
    async getPost(date) {
        try {
            if (!Database.has(date, 'AHP'))
                return;
            const data = (await Database.register(date, 'AHP')).getCollection(), bidData = data?.b ?? {}, bidKeys = Object.keys(bidData).reverse();
            return {
                date: date,
                name: data?.n ?? data.i,
                itemName: data.i,
                amount: data.a,
                price: bidData?.[bidKeys[0]]?.[1] ?? data.p,
                startPrice: data.p,
                buyout: data.o,
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
        }
        catch (e) {
            console.warn(e + e.stack);
        }
    },
    async verifyPost(date, data) {
        await sleep(5);
        if (!Database.has(date, 'AHP'))
            return;
        const many = (await Database.register(date, 'AHP')).readMany(['i', 'b']);
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
    async updatePost(date, data) {
        const db = await Database.register(date, 'AHP'), update = {};
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
        if (data.hasOwnProperty('buyout'))
            Object.assign(update, { o: data.buyout });
        if (data.hasOwnProperty('time'))
            Object.assign(update, { t: data.time });
        if (data.hasOwnProperty('creator'))
            Object.assign(update, { c: [data.creator[0], data.creator[1], data.creator[2] ? 1 : 0] });
        if (data.hasOwnProperty('removedIDs'))
            Object.assign(update, { r: data.removedIDs });
        if (data.hasOwnProperty('enchants'))
            Object.assign(update, { e: data.enchants });
        db.writeMany(update);
        await sleep(20);
    },
    /**
     * Creates a auction post
     * @param {PlayerType} player The player
     * @param {ItemData} item The item being put up for auction
     * @param {writeData} data Additional data
     */
    async publishPost(player, item, data) {
        const date = numberToHex(new Date().getTime() + (data.time * 3.6e+6));
        AH.updatePost(date, {
            name: data.name,
            itemName: data.itemName,
            amount: item.amount,
            time: data.time,
            startPrice: data.price,
            creator: [player.rID, player.name, data.silent],
            enchants: item?.enchantments?.map(e => [e.id, e.level]) ?? []
        });
        AH.client.update(player.rID, 'AHP', 'add', date);
        (await Database.register(date, 'AHI')).write('', item);
        await sleep(10);
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
        err.setBody(`§4${error || 'Oops!§c A error occurred and we are usable to parse formData'}. §r§4Please try again or come back later.\n\nIf you are seeing error again please report it to a Administrator. Thank you!§r`);
        err.setButton1('§e§lTry again§r');
        err.setButton2('§4§lClose§r');
        err.send(player, res => res.selection && from(player, AH.openAH));
    },
    reg: {
        AHP: ['AHP', undefined],
        AHB: ['AHP', undefined],
        AHC: ['AHC', undefined],
        AHS: [undefined, undefined]
    },
    client: {
        AHR: null,
        read(rID, key) {
            let value = AH.reg[key][1].allKeys().find(k => k.startsWith(rID));
            if (!value)
                return [];
            return JSON.parse(value.replace(rID, '').replace(/\$-\$/g, '"')).filter(e => {
                if (!AH.reg[key][0] || Database.has(e, key))
                    return true;
                AH.client.update(rID, key, 'remove', e);
            });
        },
        update(rID, key, operation, value) {
            let regKey = AH.reg[key][1].allKeys().find(k => k.startsWith(rID)), data;
            if (regKey) {
                AH.reg[key][1].delete(regKey);
                data = JSON.parse(regKey.replace(rID, '').replace(/\$-\$/g, '"'));
            }
            else
                data = [];
            if (operation === 'add')
                !data.includes(value) && data.push(value);
            else
                data.splice(data.indexOf(value), 1);
            if (!data.length)
                return;
            AH.reg[key][1].write(`${rID}${JSON.stringify(data).replace(/"/g, '$-$')}`, 0);
        }
    }
};
(async function () {
    AH.reg.AHP[1] = await Database.registry('AH:AHP');
    AH.reg.AHB[1] = await Database.registry('AH:AHB');
    AH.reg.AHC[1] = await Database.registry('AH:AHC');
    AH.reg.AHS[1] = await Database.registry('AH:AHS');
    AH.client.AHR = await Database.registry('AH:AHR');
})();
//Opening methods
if (AH.config.npc)
    world.afterEvents.entityHitEntity.subscribe(data => {
        if (data.hitEntity?.typeId !== 'rot:ah' || data.damagingEntity.typeId !== 'minecraft:player')
            return;
        const player = Player.playerType(data.damagingEntity, { from: AH.config.npcName, sound: false });
        if (player.isAdmin && player.isSneaking)
            return data.hitEntity.triggerEvent('rot:despawn');
        try {
            AH.openAH(player);
        }
        catch (e) {
            console.warn(e + e.stack);
            AH.errorForm(player, AH.openAH);
        }
    });
import('./interval.js');
