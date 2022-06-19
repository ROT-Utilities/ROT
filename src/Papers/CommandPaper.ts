/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
notbeer (ROT's base code),
baboonie (!inven code)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |   
 |    |   \/    |    \    |   
 |____|_  /\_______  /____|   
        \/         \/         
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2022 all rights reserved by Moisesgamingtv9. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you
*/
import { BeforeChatEvent } from 'mojang-minecraft';
/*
 * Welcome to the Command page!
 * Main Developer: notbeer
 * Sub developer: Mo9ses
 * Link to name: Command Page!
*/
interface registerInformation {
    private?: boolean,
    cancelMessage?: boolean,
    name: string,
    lister?: boolean,
    description?: string,
    aliases?: string[],
    category?: string,
    admin?: boolean,
    documentation?: {
        usage?: string,
        information?: string,
        subaliases?: string[],
        examples?: string[],
        notes?: string,
        developers?: string[]
    }
}
interface storedRegisterInformation extends registerInformation {
    callback: (data: BeforeChatEvent, args: Array<string>) => void
}
export class CommandPaper {
    private _registrationInformation: Array<storedRegisterInformation> = [];
    /**
     * Register a command with a callback
     * @param {registerInformation} register An object of information needed to register the custom command
     * @param {(data: BeforeChatEvent, args: Array<string>) => void} callback Code you want to execute when the command is executed
     * @example .register({name: 'ping'}, (chatmsg, args) =>   Server.broadcast('Pong!', chatmsg.sender.name));
     */
    public register(register: registerInformation, callback: (data: BeforeChatEvent, args: Array<string>) => void): void {
        this._registrationInformation.push({
            private: register.private ? true : false,
            cancelMessage: register.cancelMessage ? true : false,
            name: register.name,
            lister: register.lister ? true : false,
            description: register.description ? register.description : null,
            aliases: register.aliases ? register.aliases.map(v => v.toLowerCase()) : null,
            category: register.category ? register.category.toUpperCase() : null,
            admin: register.admin ? true : false,
            documentation: register.documentation ? {
                usage: register.documentation.usage ? register.documentation.usage : null,
                information: register.documentation.information ? register.documentation.information : null,
                notes: register.documentation.notes ? register.documentation.notes : null,
                examples: register.documentation.examples ? register.documentation.examples : null,
                developers: register.documentation.developers ? register.documentation.developers : null
            } : null,
            callback
        });
    }
    /**
     * Get a list of registered commands
     * @returns {Array<string>}
     * @example .get();
     */
    public get(): Array<string> {
        const commands: Array<string> = [];
        this._registrationInformation.forEach(element => {
            if(element.private) return;
            commands.push(element.name);
        });
        return commands;
    }
    /**
     * Get all the registered informations
     * @returns {Array<storedRegisterInformation>}
     * @example .getAllRegistration();
     */
    public getAllRegistation(): Array<storedRegisterInformation> {
        return this._registrationInformation;
    }
    /**
     * Get registration information on a specific command
     * @param name The command name or alias you want to get information on
     * @returns {storedRegisterInformation}
     * @example .getRegistration('ping');
     */
    public getRegistration(name: string): storedRegisterInformation {
        const command = this._registrationInformation.some(element => element.name.toLowerCase() === name || element.aliases && element.aliases.includes(name));
        if(!command) return;
        let register;
        this._registrationInformation.forEach(element => {
            if(element.private) return;
            const eachCommand = element.name.toLowerCase() === name || element.aliases && element.aliases.includes(name);
            if(!eachCommand) return;
            register = element;
        });
        return register;
    }
}