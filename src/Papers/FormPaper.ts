/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
notbeer (ROT's base code)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |   
 |    |   \/    |    \    |   
 |____|_  /\_______  /____|   
        \/         \/         
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
Â© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { world, Player } from 'mojang-minecraft';
import Server from '../ServerBook';
// @ts-ignore
import { ActionFormData, MessageFormData, ModalFormData } from 'mojang-minecraft-ui';
/*
 * Welcome to the Form page!
 * Main Developer: Mo9ses
 * Notes: I stole the TS interfaces form PMK... Shhh...
 * Sub developer: NOBOY
 * Link to name: DataBase Builder
*/
export interface simpleFormResponse {
    readonly selection: number
    readonly isCanceled: boolean
}
export interface advancedFormResponse {
    readonly formValues: any[]
    readonly isCanceled: boolean
}
/**
 * Fetch an online players data
 * @param {string} player The player you are looking for
 * @returns {Player || nullish}
 * @example fetch('mo9ses');
 */
const fetch = (player: string) => {
    for(const p of world.getPlayers()) if(player && p.name.toLowerCase() === player.toLowerCase()) return p;
}
/**
 * @class A Action Form is simple gametest UI that has only buttons
 * @example const dc = new ActionForm(); dc.show('Mo9ses');
 * @returns Shows a simple message form to the member "Mo9ses"
 */
export class ActionForm {
    private readonly form: ActionFormData = new ActionFormData();
    /**
     * @function setTitle Sets the title of the form
     * @param {string} text The title text
     * @example .setTitle('Server!');
     * @returns {void}
     */
    public setTitle(text: string): void {
        this.form.title(text);
    }
    /**
     * @function setBody Sets the body of the form
     * @param {string} text The body text
     * @example .setBody('Login to be able to play on this server!');
     * @returns {void}
     */
    public setBody(text: string): void {
        this.form.body(text);
    }
    /**
     * @function addButton Adds a button to the form
     * @param {string} text The button text
     * @param {string} text The icon path of the button. This is not required to add a button
     * @example .addButton('Ok!', 'textures/UI/agree');
     * @returns {void}
     */
    public addButton(text: string, iconPath?: string): void {
        this.form.button(text, iconPath ?? undefined);
    }
    /**
     * @function send The sends the UI to a member
     * @param {string} player The member's you want to send it to
     * @param callback a asynchronous arrow function that will run after the form is filled out (Not fully if a model form).
     * @example .send('Mo9ses');
     * @returns {void}
     */
    public send(player: string, callback?: (res: simpleFormResponse, player: Player) => void): void {
        this.form.show(fetch(player)).then((res: simpleFormResponse) => {
            if(!callback) return;
            return callback(res, fetch(player));
            // @ts-ignore
        }).catch((err: any) => console.warn(err));
    }
}
/**
 * @class A Message Form is simple gametest UI that has TWO only buttons
 * @example const dc = new MessageForm(); dc.show('Mo9ses');
 * @returns Shows a simple message form to the player "Mo9ses"
 */
export class MessageForm {
    private readonly form: MessageFormData  = new MessageFormData();
    /**
     * @function setTitle Sets the title of the form
     * @param {string} text The title text
     * @example .setTitle('Server!');
     * @returns {void}
     */
    public setTitle(text: string): void {
        this.form.title(text);
    }
    /**
     * @function setBody Sets the body of the form
     * @param {string} text The body text
     * @example .setBody('ROT?');
     * @returns {void}
     */
    public setBody(text: string): void {
        this.form.body(text);
    }
    /**
     * @function setButton1 Adds the first button to the form
     * @param {string} text The button text
     * @example .setButton1('YESSSSS!');
     * @returns {void}
     */
    public setButton1(text: string): void {
        this.form.button1(text);
    }
    /**
     * @function setButton2 Adds the second button to the form
     * @param {string} text The button text
     * @example .setButton2('DOWNLOAD IT!!!');
     * @returns {void}
     */
    public setButton2(text: string): void {
        this.form.button2(text);
    }
    /**
     * @function send The sends the UI to a member
     * @param {string} player The member's you want to send it to
     * @param callback a asynchronous arrow function that will run after the form is filled out (Not fully if a model form).
     * @example .send('Mo9ses');
     * @returns {void}
     */
    public send(player: string, callback?: (res: simpleFormResponse, player: Player) => void): void {
        this.form.show(fetch(player)).then((res: simpleFormResponse) => {
            if(!callback) return;
            return callback(res, fetch(player));
            // @ts-ignore
        }).catch((err: any) => console.warn(err));
    }
}
/**
 * @class A Modal Form is a bit more advanced gametest UI that has sliders, text fields, ane much more, BUT NO BUTTONS!
 * @example const dc = new ModelForm(); dc.show('Mo9ses');
 * @returns Shows a simple ModalForm form to the player "Mo9ses"
 */
export class ModalForm {
    private readonly form: ModalFormData = new ModalFormData();
    /**
     * @function setTitle Sets the title of the form
     * @param {string} text The title text
     * @example .setTitle('Server!');
     * @returns {void}
     */
    public setTitle(text: string): void {
        this.form.title(text);
    }
    /**
     * @function addInput Add a text box for the member to type in
     * @param {string} label The name for the text box
     * @param {string} placeHolderText The display text in the empty text box
     * @param {string} defaultValue The default text that will be in the box (Not required!)
     * @example .addImput('What is your IP?', '0.0.0.0');
     * @returns {void}
     */
    public addInput(label: string, placeHolderText: string, defaultValue?: string): void {
        this.form.textField(label, placeHolderText, defaultValue ?? '');
    }
    /**
     * @function addDropdown Make a drop down menu to the form
     * @param {string} label the name of the drop down
     * @param {string[]} options The options in the drop down
     * @param {number} defaultValueIndex Where should the default value be when you first open the form
     * @example .addDropdown('Where do you live?', ['Mexico', 'America', 'Asia'], 1);
     * @returns {void}
     */
    public addDropdown(label: string, options: string[], defaultValueIndex?: number): void {
        this.form.dropdown(label, options, defaultValueIndex ?? 0);
    }
    /**
     * @function addSlider Add a slider that will sliiiiiiiiiiiiide on the fooooooorm!
     * @param {string} label The name of the sliiiiiiider
     * @param {number} minimumValue The smallest number for the slider
     * @param {number} maximumValue The bigest number for the slider
     * @param {number} valueStep The amount should it step each time you move it left or right
     * @param {number} defaultValue Where should it be at when you first open the UI
     * @example .addSlider('Rate ROT', 9, 10, 1, 10);
     * @returns {void}
     */
    public addSlider(label: string, minimumValue: number, maximumValue: number, valueStep?: number, defaultValue?: number): void {
        if(minimumValue >= maximumValue) throw new Error('[Forms UI Silder] Error - the Min value cannot be greater than the Max value');
        this.form.slider(label, minimumValue, maximumValue, valueStep ?? 1, defaultValue ?? ~~(maximumValue / minimumValue));
    }
    /**
     * @function addToggle Adds a on/off button to the form
     * @param {string} label Then name of the toggle switch
     * @param {boolean} defaultValue Be either on or off when they first open the form
     * @example .addToggle('Cheese?');
     * @returns {void}
     */
    public addToggle(label: string, defaultValue?: boolean): void {
        this.form.toggle(label, defaultValue ?? false);
    }
    /**
     * @function addIcon Adds a icon to the form?...
     * @param {string} iconPath the image file directory where the icon is in the texture pack
     * @example .addIcon('textures/moss');
     * @returns {void}
     */
    public addIcon(iconPath: string): void {
        this.form.icon(iconPath);
    }
    /**
     * @function send The sends the UI to a member
     * @param {string} player The member's you want to send it to
     * @param callback a asynchronous arrow function that will run after the form is filled out (Not fully if a model form).
     * @example .send('Mo9ses');
     * @returns {void}
     */
    public send(player: string, callback?: (res: advancedFormResponse, player: Player) => void): void {
        this.form.show(fetch(player)).then((res: advancedFormResponse) => {
            if(!callback) return;
            return callback(res, fetch(player));
            // @ts-ignore
        }).catch((err: any) => console.warn(err));
    }
}