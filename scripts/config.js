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
© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
//Hello and welcome to the config file and where you can edit things of ROT!
export const config = {
    //ROT settings:
    prefix: '!',
    displayChatTime: true,
    defaultRank: '§bMember',
    ROTDiscord: 'https://discord.gg/2ADBWfcC6S',
    discord: 'https://discord.gg/2ADBWfcC6S',
    adminTag: 'v',
    hideAdminTag: false,
    rottleRewards: false,
    rottleRewardsCmds: [
        'give "@rottler" diamond',
        'summon tnt'
    ],
    rottleAttemps: 10,
    defaultNameColor: '§c',
    defaultChatColor: '§f',
    hiveArrow: true,
    bannedPlayers: {},
    toggle: {
        Server: {
            broadcast: true,
            close: true,
            clearchat: true,
            //members: true,
        },
        Management: {
            //ban: true,
            rank: true,
            tac: true,
        },
        Escape: {
            cmd: true,
            // feed: true,
            // GMA: true,
            // GMC: true,
            // GMS: true,
            // heal: true,
            //home: true,
            // kill: true,
            // repair: true,
            sudo: true,
            // top: true,
            //vanish: true,
        },
        Fantasy: {
            rickroll: true,
            rottle: true,
        },
        ROT: {
            //form: true,
            //quick: true,
            help: true,
        },
    },
    useQuick: true
};
