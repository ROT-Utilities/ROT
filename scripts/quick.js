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
import { MinecraftBlockTypes } from "@minecraft/server";
//Hello and welcome to the config file and where you can edit things of ROT!
export const quick = {
    //ROT settings:
    prefix: '!',
    release: 5,
    displayChatTime: true,
    chatStyle: '$rank $player $time: §f$msg§r',
    chatRanks: true,
    rankStyle: '',
    defaultRank: '§bMember',
    ROTDiscord: 'https://discord.gg/2ADBWfcC6S',
    discord: 'https://discord.gg/2ADBWfcC6S',
    adminTag: 'v',
    hideAdminTag: false,
    rottleRewards: [
    //Example of commands: 'give "@rottler" diamond',
    ],
    rottleAttemps: 10,
    rateLimit: 2,
    defaultNameColor: '§e',
    defaultChatColor: '§f',
    hiveArrow: true,
    bannedPlayers: {},
    automod: {
        //validValues: 'block' | 'warn' | 'ban' | 'disable'
        /**
         * Block: Blocks the cheat. No ban or warns
         * Warn: Warns the player, if the player reach maxWarms will be auto-banned from the server forever
         * Ban: The player will be banned immediately
         * Disable: The protection will be disabled, it will not protect your server from this cheat.
         */
        crasher: 'block',
        cbe: 'warn',
        nuker: 'warn',
        unobtainable: 'warn',
    },
    toggle: {
        Server: {
            broadcast: true,
            clearchat: true,
            scoreboard: true,
            spawn: true,
        },
        Management: {
            ban: true,
            rank: true,
            tac: true,
            kicktags: true,
        },
        Structure: {
            leaderboard: true,
            text: true
        },
        Escape: {
        // feed: true,
        // heal: true,
        // home: true,
        // kill: true,
        // repair: true,
        // sudo: true,
        // top: true,
        // vanish: true,
        },
        Fantasy: {
            rickroll: true,
            rottle: true,
        },
        Miscellaneous: {
            timezone: true,
            dimension: true,
        },
        ROT: {
            //ui: true,
            //quick: true,
            help: true //Please keep this command at the bottom
        }
    },
    epics: {
        "Auction House": {
            enabled: true,
            entry: 'main',
            obj: 'money',
            tag: 'ah',
            currency: 'Gold',
            houseName: 'Auction House',
            color1: '§a',
            color2: '§e',
            color3: '§6',
            npc: true,
            npcName: 'Black Hat Matt',
            comeBack: true,
            namePost: true,
            sliderStep: 10,
            postAmount: [10, 1000000],
            createPostPercent: [5, 5000],
            buyersPremiumPercent: [5, 1000],
            removePostPercent: [10, 1000],
            maxPosts: 100,
            maxClientPosts: 3,
            bannedItems: [
                'minecraft:air',
            ],
            coolHouseNames: true,
            maxPostTime: 48,
            maxHoldTime: 72,
            checkPosts: 60,
            boxNumber: true,
            secondTake: true,
            tryTime: 300, //Do NOT change this number. I'd only make it lower if my sever is SUPER laggy
        },
        "Factions": {
            enabled: true,
            entry: 'main',
            obj: 'money',
            powerObj: 'power',
            autoTag: 'automap',
            spawn: [0, 200, 0],
            radius: 300,
            maxRadius: 10000,
            autoTimer: 15,
            veiwFaction: true,
            maxPlayers: 10,
            maxPlayerClaims: 5,
            defaultOpen: false,
            powerKill: 1,
            powerDeath: 2,
            powerHour: 5,
            createPrice: 0,
            claimCost: 1,
            minPower: 1,
            maxPower: 10,
            startPower: 5,
            upgradePrice: 5000,
            maxPowerPerUpgrade: 5,
            upgrades: 5,
            inviteExpireTime: 30000,
            starterPowerAmount: 5,
            minFacClaimLand: 3,
            minClaimLand: 1,
            chat: true,
            mostPowerClaims: true,
            containers: [
                MinecraftBlockTypes.chest.id,
                MinecraftBlockTypes.trappedChest.id,
                MinecraftBlockTypes.barrel.id,
                MinecraftBlockTypes.shulkerBox.id,
                MinecraftBlockTypes.undyedShulkerBox.id
            ]
        },
        "Slappers": {
            enabled: false,
            entry: "main",
            editItem: ['minecraft:blaze_rod', '§eEDIT SLAPPER§r'],
            killItem: ['minecraft:barrier', '§cKILL SLAPPER§r']
        },
        "Automod": {
            enabled: false,
            entry: "main",
            bypass: "c",
            maxWarns: 3,
            automod: {
                crasher: true
            },
            crasher: 30000000 //Don't change this number
        },
        "Director": {
            enabled: false,
            entry: "main",
        }
    },
    tales: [
        'beforeChat',
        'playerConnect'
    ],
    useQuick: true
};
export default quick;
