/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer),
notbeer (ROT's base code)
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
const config = {
    //ROT settings:
    basePrefix: '!', //This is the base prefix. If you haven't noticed, when you first setup ROT the default prefix is '!'
    commandCooldown: 3, //This is seconds BTW
    antiCommandPvP: true, //This will stop people from doing commands if they recently got hit by another player (players only not entities or other crap)
    displayChatTime: true,
    antiSpam: true,
    defaultRank: '§bMember',
    theDiscord: 'https://discord.gg/2ADBWfcC6S', //Change dis you gay!
    joinMessage: true,
    adminTag: 'v', //Whatever you do... Don't set the tag to "Admin"! Hackers can geuss that easily and give themselfs the tag using cbe
    trustedTag: 't', //The tag for the trusted players
    hideAdminTag: false, //If true, ROT will hide your new admin tag making it the only way a rule breaker could get access to ROT commands is by geussing the tag by chance, or looking at the tags of an admin somehow ¯\_(ツ)_/¯
    forceAdmin: false, //If true, ROT will ban anybody that HAS the admin tag and is NOT on the list below!_
    forcedAdmins: [
        'Mo9ses',
        'Your-Name!'
    ],
    fireworksAgain: true, //Summuns fireworks when someone joins back again
    tellTime: false, //Tells the member how much time in miliseconds it takes ROT to preform a action
    tpaTime: 60, //The amount of time in seconds it takes before a TPA is automatically declined
    tpHere: true, //If true, when someone accepts a TPA request they will be teleported to the person that sent it.
    rottleRewards: false,
    rottleRewardsCmds: [
        'give "@rottler" diamond', //Use @rottler for the winners name
        'summon tnt'
    ],
    rottleAttemps: 10,
    kickAFK: true, //Kick AFK people?
    membersCheckBal: true, //If true, other members can see other player's balance using the !bal <player> command
    letThemReload: true, //Allows players to reload their island in the event that an error happens
    letThemDelete: true, //Allows players to delete their island
    spamMuteTime: 3, //This is minutes BTW
    wildCoolDown: 8, //Seconds BTW
    hiveArrow: false, //You need the ROT texture pack enabled to enable this
    hiveArrowChatColor: '§7',
    defaultNameColor: '§c',
    defaultChatColor: '§f', 
    coolerChatRanks: true,
    joinTeleport: false, //Players will be teleported back to spawn when the join the server
    antiNuker: true, //Stops hackers from nuking the server (Destroying like 30 blocks in a second)
    antiCrasher: true, //Stops hackers from using the crasher hack to
    anti32k: true,
    antiReach: true,
    ROTCommandTag: true, //If you don't know
    plotSaveTime: 30, //How much time in seconds all plots be saved,
    bannedItems: [
        'minecraft:portal',
        'minecraft:item.soul_campfire',
        'minecraft:fire',
        'minecraft:item.chain',
        'minecraft:item.warped_door',
        'minecraft:item.crimson_door',
        'minecraft:item.campfire',
        'minecraft:item.kelp',
        'minecraft:bee_nest',
        'minecraft:beehive',
        'minecraft:item.wooden_door',
        'minecraft:item.iron_door',
        'minecraft:item.cake',
        'minecraft:item.reeds',
        'minecraft:item.camera',
        'minecraft:item.frame',
        'minecraft:pistonarmcollision',
        'minecraft:movingBlock',
        'minecraft:item.cake',
        'minecraft:item.flower_pot',
        'minecraft:info_update2',
        'minecraft:stickyPistonArmCollision',
        'minecraft:movingblock',
        'minecraft:invisiblebedrock',
        'minecraft:glowingobsidian',
        'minecraft:flowing_water',
        'minecraft:flowing_lava',
        'minecraft:item.nether_sprouts'
    ],
    //Keep in mind this will not remove the blocks that were already placed
    bannedBlocks: [ //I'd use this if you want to let people hold a block, but not be able to place it
        'minecraft:bee_nest',
        'minecraft:beehive'
    ],
    tellRegionBuild: true,
    tellRegionMine: true,
    tellRegionHit: true,
    tellRegionExplode: true, //Tells near by people not to explode blocks in the region in a explosion happens
    maxEnchant: 1, //The maximum enchant level added on top of normnal enchant level
    //ROT commands/categories:
    ROT: true, //This is the ROT category not ROT itself
    help: true,
    setup: true, //You can't setup ROT witheut this command
    debug: true, //I suggest leaving this one becasue if you have problems with your ROT, it's going to be trouble!
    prefix: true,
    reset: true,
    db: true,
    //Server
    Server: true,
    broadcast: true,
    close: true,
    members: true, //ROT will keep a track of all the members that joined the game, when they join, and their member UUID (A random id number ROT gives them), also this does clear the current saved members if turned off!
    clearchat: true,
    scoreboard: true,
    discord: true,
    realm: true,
    //Management category
    Management: true,
    ban: true,
    mute: true,
    ranks: true,
    colors: true,
    inventory: true,
    kicktags: true,
    AFK: true,
    timeout: true,
    tac: true,
    //Miscellaneous category
    Miscellaneous: true,
    smyte: true,
    nothing: true,
    privatechat: true,
    timezone: true,
    dimension: true,
    click: true,
    lore: true,
    sudo: true,
    gen: true,
    //Escape category
    Escape: true,
    warp: true,
    pwarp: true,
    cmd: true,
    feed: true,
    heal: true,
    top: true,
    kill: true,
    vanish: true,
    health: true,
    wild: true,
    home: true,
    spawn: true,
    tpa: true,
    sleep: true,
    GMA: true,
    GMC: true,
    GMS: true,
    repair: true,
    near: true,
    //Building category
    Building: true,
    text: true,
    leaderboard: true,
    plot: true,
    region: true,
    //Fantasy category
    Fantasy: true,
    rickroll: true,
    rottle: true
} as const;
export default config;