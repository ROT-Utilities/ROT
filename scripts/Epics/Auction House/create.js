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
import { EnchantmentTypes } from "@minecraft/server";
import { metricNumbers } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import { confirmForm } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { getItemData } from "../../Papers/Paragraphs/itemParagraph.js";
import { MessageForm, ModalForm } from "../../Papers/FormPaper.js";
import { serverPosts } from "./server.js";
import { AH } from "./main.js";
import Database from "../../Papers/DatabasePaper.js";
//The form that opens when you are creating a auction
export async function createPost(player, from, data) {
    //Checks if the player has reached their max auction limit
    const clientPosts = AH.client.read(player.rID, 'AHP');
    if (clientPosts.length >= AH.config.maxClientPosts)
        return player.send('§c§lError §7-§r You have reached the maximum amount of auctions you can have running at time. Remove one auctions or wait for the item to be auctioned off.');
    const allPosts = Database.allTables('AHP');
    //Checks if we reached the max auctions
    if (allPosts?.length >= AH.config.maxPosts)
        return player.send('§c§lError §7-§r The server has reached the maximum active auctions. Please come back later.');
    const inventory = player.getComponent('minecraft:inventory').container, item = inventory.getItem(player.selectedSlot);
    //Checks if the item exists
    if (!item || !item?.typeId || !item.amount)
        return player.send('§c§lError §7-§r You have to be holding the item you want to put up for auction.');
    //Checks if the item ID is not on the list of prohibited items
    if (AH.config.bannedItems.includes(item.typeId))
        return player.send('§c§lError §7-§r You cannot put this item up for auction XD');
    const itemData = getItemData(item);
    //Check enchants
    if (itemData.enchantments?.some(e => e.level > EnchantmentTypes.get(e.id).maxLevel))
        return player.send('§c§lError §7-§r This item has illegal enchantment values.');
    //Confirm create auction screen
    const itemName = item.typeId.match(/:([\s\S]*)$/)[1].replace(/[\W_]/g, ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (!(await confirmForm(player, '§8§lAuction off this item?§r', `Do you really want to put §l§c${item.amount} ${itemName}(s)§r up for auction? You can only auction the items you are holding.`)))
        return clientPosts.length ? from(player, AH.openAH) : AH.openAH(player);
    //Creating the auction Modalform
    const auction = new ModalForm(), oldData = data ?? {};
    auction.setTitle('§a§lCreate auction§r');
    auction.addInput('Display name (Max 15 chars)', oldData.name ?? itemName, oldData.name ?? itemName);
    if (AH.config.boxNumber)
        auction.addInput('Starting bid', `${AH.config.postAmount[0]}-${AH.config.postAmount[1]}`, oldData?.price?.toString() ?? AH.config.postAmount[0].toString());
    else
        auction.addSlider('Starting bid', AH.config.postAmount[0], AH.config.postAmount[1], AH.config.sliderStep, oldData?.price ?? AH.config.postAmount[0]);
    auction.addSlider('Close Auction in __ hours', 1, AH.config.maxPostTime, 1, oldData?.close ?? (~~(AH.config.maxPostTime / 2) || 1));
    auction.addToggle('Silent auction? (hide name)', oldData?.silent ?? false);
    auction.send(player, async (res) => {
        if (res.canceled)
            return clientPosts.length ? from(player, AH.openAH) : AH.openAH(player);
        const newData = { name: res.formValues[0], price: res.formValues[1], close: res.formValues[2], silent: res.formValues[3] };
        const money = Number(res.formValues[1]);
        //Checks if money is NaN
        if (res.formValues[1].replace(/\d/g, '') !== '' || isNaN(money))
            return await confirmForm(player, '§5Not a number§r', `"§c${res.formValues[1]}§r" is not a number. Would you like to try again?`) ? createPost(player, from, newData) : AH.openAH(player);
        //Checks if the amount is vaild
        if (money < AH.config.postAmount[0] || money > AH.config.postAmount[1])
            return await confirmForm(player, '§5Size matters?§r', `"§5${res.formValues[1]}§r" is either too small or too big! Choose a number between §6${AH.config.postAmount[0]}-${AH.config.postAmount[1]}`) ? createPost(player, from, newData) : AH.openAH(player);
        //Checks if they have enough money to create the auction
        let keepersKeep = ~~(money / 100) * AH.config.createPostPercent[0], postName = itemName;
        if (keepersKeep > AH.config.createPostPercent[1])
            keepersKeep = AH.config.createPostPercent[1];
        if (player.getScore(AH.config.obj) < keepersKeep)
            return player.send(`§c§lError §7-§r You don\'t have enough money to put this item up for auction. You need to pay me §c${Math.abs(player.getScore(AH.config.obj) - keepersKeep)}§6 ${AH.config.currency}§r or make the price lower.`);
        //Checks if the item name is vaild
        if (itemName != res.formValues[0]) {
            if (res.formValues[0].replace(/[a-zA-Z0-9'+& ]/g, '') !== '')
                return player.send('§c§lError §7-§r No special symbols, words, or characters in the item name please!');
            if (res.formValues[0].length > 15)
                return player.send('§c§lError §7-§r The auction display name is too long!');
            postName = res.formValues[0];
        }
        //Adding auction and other stuff
        if (JSON.stringify(getItemData(inventory.getItem(player.selectedSlot))) !== JSON.stringify(itemData))
            return player.send('§c§lError §7-§r The auction could not be created because you lost the item!');
        AH.publishPost(player, itemData, {
            name: AH.config.namePost ? postName : itemName,
            itemName: itemName,
            price: money,
            time: res.formValues[2],
            silent: res.formValues[3]
        });
        //Taking item and removing money
        inventory.setItem(player.selectedSlot);
        player.runCommandAsync(`scoreboard players remove @s "${AH.config.obj}" ${keepersKeep}`);
        const success = new MessageForm();
        success.setTitle('§a§lCongratulations!§r');
        success.setBody(`§l§aSuccess!§r Your §l§c${item.amount} ${itemName}(s)§r are going to be in a auction with a starting bid of §a$${metricNumbers(res.formValues[1])}§6 ${AH.config.currency}§r with the display name "§c${res.formValues[0]}§r"! Do you want to see the auction?`);
        success.setButton1('Sure!');
        success.setButton2('Nah...');
        success.send(player, res => res.selection ? serverPosts(player, from) : from(player, AH.openAH));
    });
}
