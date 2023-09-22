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
//Hello and welcome to the config file and where you can edit things of ROT!
export const quick = {
    //ROT settings:
    prefix: '!',
    release: 5,
    displayChatTime: true,
    chatStyle: '$rank $player $time: §f$msg§r',
    welcomeBack: 'Welcome back §c$player§e!',
    chatRanks: true,
    rankStyle: '',
    defaultRank: '§bMember',
    YourDiscord: 'https://discord.gg/2ADBWfcC6S',
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
    displayHealth: true,
    bannedPlayers: {},
    dimNotAllowedLoc: { loc: { x: 10, y: -60, z: 10 }, dim: 'overworld' },
    maxHomes: 5,
    homeDims: ['minecraft:overworld', 'minecraft:the_end', 'minecraft:nether'],
    enchantmentList: ['aqua_affinity', 'bane_of_arthropods', 'binding', 'blast_protection', 'channeling', 'depth_strider', 'efficiency', 'feather_falling', 'fire_aspect', 'fire_protection', 'flame', 'fortune', 'frost_walker', 'impaling', 'infinity', 'knockback', 'looting', 'loyalty', 'luck_of_the_sea', 'lure', 'mending', 'multishot', 'piercing', 'power', 'projectile_protection', 'protection', 'punch', 'quick_charge', 'respiration', 'riptide', 'sharpness', 'silk_touch', 'smite', 'soul_speed', 'swift_sneak', 'thorns', 'unbreaking', 'vanishing'],
    toggle: {
        Server: {
            broadcast: true,
            clearchat: true,
            scoreboard: true,
            members: true,
            spawn: true,
            warp: true,
            tps: true,
            lockdimension: true,
        },
        Management: {
            ban: true,
            unban: true,
            rank: true,
            tac: true,
            inventory: true,
            kicktags: true,
            afk: true
        },
        Structure: {
            leaderboard: true,
            text: true
        },
        Fantasy: {
            rickroll: true,
            rottle: true,
            home: true,
            tpa: true,
        },
        Miscellaneous: {
            lore: true,
            click: true,
            timezone: true,
            dimension: true,
        },
        ROT: {
            //ui: true,
            quick: true,
            help: true //Please keep this command at the bottom
        }
    },
    epics: {
        "Auction House": {
            enabled: true,
            entry: 'main',
            clientShop: false,
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
            minFacClaimLand: 3,
            minClaimLand: 1,
            mostPowerClaims: true,
            containers: [
                'minecraft:chest',
                'minecraft:trapped_chest',
                'minecraft:barrel',
                'minecraft:shulker_box',
                'minecraft:undyed_shulker_box'
            ],
            blockObi: false,
            chat: true, //If true your faction name will appear in chat
        },
        "Money Transfer": {
            enabled: true,
            entry: 'main',
            houseName: 'Money Transfer',
            currency: 'Gold',
            obj: 'money',
            tag: 'mt',
            color1: '§6',
            color2: '§g',
            color3: '§e',
            npc: true,
            npcName: 'Jimmy Jackpot',
            comeBack: true,
            coolHouseNames: true
        },
        "Automod": {
            enabled: false,
            entry: "main",
            bypass: "c",
            maxWarns: 3,
            automod: {
                crasher: true,
                unobtainable: true,
                block: true,
                teleport: true,
            },
            protections: {
                block: {
                    action: 'warn' //Action that will be taken for the player; valid values: kick | warn | cancel
                },
                unobtainable: {
                    action: 'kick' //Action that will be taken for the player; valid values: kick | warn | cancel
                },
                crasher: {
                    action: 'kick',
                    distance: 30000000,
                    location: { x: 1, y: 1, z: 1 },
                    dimension: 'overworld' //Dimension to which the player will teleport when attempting to crash (overworld | nether | the_end)
                },
                teleport: {
                    action: 'cancel',
                    skip: 'skip-teleport' //Tag required to skip this protection once
                },
            }
        }
    },
    tales: [
        'beforeChat',
        'playerConnect'
    ],
    version: 'ROT',
    developerCommands: false,
    developerLogging: true,
    logs: {
        errors: [],
        tps: [],
        epics: [],
        commands: [],
        commandLogs: [],
        connectedLogs: [],
        intervalAmount: 0,
        intervalTicks: []
    },
    useQuick: true
};
export default quick;
