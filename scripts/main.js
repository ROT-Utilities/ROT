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
import { world } from '@minecraft/server';
import { config } from './config.js';
import { DatabasePaper } from './Papers/DatabasePaper.js';
import { startLang } from './Papers/LangPaper.js';
import Server from './ServerBook.js';
/**
 * Quick
 * This handles in game configuration
 */
const quick = config, ROT = new DatabasePaper('server');
export default quick;
world.events.worldInitialize.subscribe(() => {
    if (ROT.read('setup'))
        startup();
    startLang();
});
/*
 * Welcome to the Main page!
 * Main Developer: Mo9ses
 * Sub developer: Nobody!
 * Link to name: MAIN ROT
 ***************************
 * startup function. This will start ROT
*/
import './Stories/ROT/setup.js';
export async function startup() {
    ROT.write('setup', 1);
    const time = new Date().getTime();
    Server.command.list.splice(Server.command.list.findIndex(c => c.name === 'setup'), 1);
    if (config.useQuick && ROT.has('ServerConfig'))
        Object.entries(ROT.read('ServerConfig')).forEach(s => Object.assign(quick, { [s[0]]: s[1] }));
    await Object.keys(quick.toggle).forEach(c => Object.keys(quick.toggle[c]).forEach(cmd => import(`./Stories/${c}/${cmd}.js`).catch(e => console.warn(`Failed to import command "${cmd}" from category "${c}"     ${e}: ${e.stack}`))));
    Server.command.list.forEach((cmd, i) => {
        try {
            const length = Object.keys(cmd.aR).length, fakeArgs = cmd.aR;
            if (length && !cmd.sT[0].length)
                throw Error(`Command "${cmd.name}" has no starting args, but has args.`);
            if (!length && cmd.sT[0].length)
                throw Error(`Command "${cmd.name}" has starting args, but no args.`);
            if (cmd.sT[0].some(a => !cmd.aR.hasOwnProperty(a)))
                throw Error(`Some of the starting arguments for the command "${cmd.name}" don't exist.`);
            Object.assign(fakeArgs, { '-1': { nA: cmd.sT[0] } });
            for (const arg in fakeArgs) {
                if (fakeArgs[arg].nN && !fakeArgs[arg].nA.length)
                    throw Error(`Argument "${arg}" from command "${cmd.name}" needs next args but, there are no args afther it.`);
                const realArgs = fakeArgs[arg].nA.filter(a => cmd.aR.hasOwnProperty(a));
                if (arg != '-1' && fakeArgs[arg].nA.length !== realArgs.length)
                    throw Error(`Argument "${arg}" from command "${cmd.name}" is asking for next argument(s) that don't exist!`);
                const argTypes = realArgs.map(a => ['sta', 'dyn'].includes(cmd.aR[a].tY) ? '' : cmd.aR[a].tY), test = [];
                argTypes.forEach(t => (!test.includes(t) || t === '') && test.unshift(t));
                if (test.length !== argTypes.length)
                    throw Error(`Argument "${arg}" from command "${cmd.name}" has two of the same types for the next arg!`);
            }
        }
        catch (e) {
            console.warn(e);
            Server.command.list.splice(i, 1);
        }
    });
    Server.broadcast(`ROT has been loaded in §3${new Date().getTime() - time}§1 milliseconds!`, 'Server');
}
