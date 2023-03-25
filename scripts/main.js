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
import { world, system } from '@minecraft/server';
system.events.beforeWatchdogTerminate.subscribe(res => res.cancel = true);
import { updateLang } from './Papers/LangPaper.js';
import Commands from './Papers/CommandPaper/CommandPaper.js';
import Server from './Papers/ServerPaper.js';
import quick from './quick.js';
/*
 * Welcome to the Main page!
 * Main Developer: Mo9ses
 * Sub developer: Nobody!
 * Link to name: MAIN ROT
 **************************
 * Quick
 * This handles in game configuration
 */
updateLang();
world.events.worldInitialize.subscribe(() => {
    Server.runCommands([
        'gamerule sendcommandfeedback false',
        'gamerule commandblockoutput false'
    ]);
    startup();
});
//Add system to [$rank] so people can do ranks as they wish
//Make a warp command
//Fix chat colors
//Finish ban command
//Add the rate limiter
//Add a way to turn off commands
//Use Array.every
//USe enum a lot more. Could be useful in the command handler
/**
 * The startup function
 */
export async function startup() {
    Server.startServer();
    if (quick.useQuick && Server.db.has('quick'))
        Object.entries(Server.db.read('quick')).forEach(s => Object.assign(quick, { [s[0]]: s[1] }));
    updateLang();
    await quick.tales.forEach(t => import(`./Tales/${t}.js`).catch(e => console.warn(`Failed to import tale "${e}"     ${e}: ${e.stack}`)));
    await Object.keys(quick.epics).forEach((e) => quick.epics[e].enabled && import(`./Epics/${e}/${quick.epics[e].entry}.js`).catch(e => console.warn(`Failed to import epic "${e}"     ${e}: ${e.stack}`)));
    await Object.keys(quick.toggle).forEach((c) => Object.keys(quick.toggle[c]).forEach((cmd) => quick.toggle[c][cmd] && import(`./Stories/${c}/${cmd}.js`).catch(e => console.warn(`Failed to import command "${cmd}" from category "${c}"     ${e}: ${e.stack}`))));
    //Checks ROT command arguments for imperfections 
    Commands.list.forEach((cmd, i) => {
        try {
            const length = Object.keys(cmd.aR).length, fakeArgs = cmd.aR;
            if (length && !cmd.sT[0].length)
                throw Error(`Command "${cmd.name}" has no starting args, but has args.`);
            if (!length && cmd.sT[0].length)
                throw Error(`Command "${cmd.name}" has starting args, but no args.`);
            if (cmd.sT[0].some(a => !cmd.aR.hasOwnProperty(a)))
                throw Error(`Some of the starting arguments for the command "${cmd.name}" don't exist.`);
            Object.assign(fakeArgs, { '-2': { nA: cmd.sT[0] } });
            for (const arg in fakeArgs) {
                if (fakeArgs[arg].nN && !fakeArgs[arg].nA.length)
                    throw Error(`Argument "${arg}" from command "${cmd.name}" needs next args but, there are no args afther it.`);
                const realArgs = fakeArgs[arg].nA.filter(a => cmd.aR.hasOwnProperty(a));
                if (arg != '-1' && fakeArgs[arg].nA.length !== realArgs.length)
                    throw Error(`Argument "${arg}" from command "${cmd.name}" is asking for next argument(s) that don't exist!`);
                const argTypes = realArgs.map(a => ['sta', 'dyn', 'ukn'].includes(cmd.aR[a].tY) ? '' : cmd.aR[a].tY), test = [];
                argTypes.forEach(t => (!test.includes(t) || t === '') && test.unshift(t));
                if (test.length !== argTypes.length)
                    throw Error(`Argument "${arg}" from command "${cmd.name}" has two of the same types for the next arg!`);
            }
        }
        catch (e) {
            console.warn(e);
            Commands.list.splice(i, 1);
        }
    });
    //Dev stuff
    // import('./Stories/test.js');
    // world.scoreboard.getObjectives().forEach(o => world.scoreboard.removeObjective(o.id));
}
//Put "Welcome back" in members story
