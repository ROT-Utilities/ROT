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
import { ServerPaper } from './Papers/ServerPaper.js';
import { CommandPaper } from './Papers/CommandPaper/CommandPaper.js';
import { PlayerPaper } from './Papers/PlayerPaper.js';
/*
 * Welcome to the SERVER Book!
 * Main Developer: Mo9ses
 * Notes: Now all the code above is combined into this section here
 * Sub developer: No-one!
 * Link to name: Server Code
*/
class ServerBook extends ServerPaper {
    constructor() {
        super(...arguments);
        //Server classes
        this.command = new CommandPaper();
        this.player = new PlayerPaper();
    }
}
/**
 * Import this
 */
const Server = new ServerBook();
export default Server;
