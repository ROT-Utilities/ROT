import { ActionFormData, MessageFormData, ModalFormData } from '@minecraft/server-ui';
/**
 * @class A Action Form is simple gametest UI that has only buttons
 * @example const dc = new ActionForm(); dc.show('Mo9ses');
 * @returns Shows a simple action form to the member "Mo9ses"
 */
export class ActionForm {
    constructor() {
        this.form = new ActionFormData();
    }
    /**
     * @function setTitle Sets the title of the form
     * @param {string} text The title text
     * @example .setTitle('Server!');
     * @returns {void}
     */
    setTitle(text) {
        this.form.title(text);
    }
    /**
     * @function setBody Sets the body of the form
     * @param {string} text The body text
     * @example .setBody('Login to be able to play on this server!');
     * @returns {void}
     */
    setBody(text) {
        this.form.body(text);
    }
    /**
     * @function addButton Adds a button to the form
     * @param {string} text The button text
     * @param {string} text The icon path of the button. This is not required to add a button
     * @example .addButton('Ok!', 'textures/UI/agree');
     * @returns {void}
     */
    addButton(text, iconPath) {
        this.form.button(text, iconPath ?? undefined);
    }
    /**
     * @function send The sends the UI to a member
     * @param {string} player The member's you want to send it to
     * @param callback a asynchronous arrow function that will run after the form is filled out (Not fully if a model form).
     * @example .send('Mo9ses');
     * @returns {void}
     */
    async send(player, callback) {
        await this.form.show(player).then((res) => {
            if (!callback)
                return;
            callback(res, player);
        }).catch((err) => console.warn(err));
    }
}
/**
 * @class A Message Form is simple gametest UI that has TWO only buttons
 * @example const dc = new MessageForm(); dc.show('Mo9ses');
 * @returns Shows a simple message form to the player "Mo9ses"
 */
export class MessageForm {
    constructor() {
        this.form = new MessageFormData();
    }
    /**
     * @function setTitle Sets the title of the form
     * @param {string} text The title text
     * @example .setTitle('Server!');
     * @returns {void}
     */
    setTitle(text) {
        this.form.title(text);
    }
    /**
     * @function setBody Sets the body of the form
     * @param {string} text The body text
     * @example .setBody('ROT?');
     * @returns {void}
     */
    setBody(text) {
        this.form.body(text);
    }
    /**
     * @function setButton1 Adds the first button to the form
     * @param {string} text The button text
     * @example .setButton1('YESSSSS!');
     * @returns {void}
     */
    setButton1(text) {
        this.form.button2(text);
    }
    /**
     * @function setButton2 Adds the second button to the form
     * @param {string} text The button text
     * @example .setButton2('DOWNLOAD IT!!!');
     * @returns {void}
     */
    setButton2(text) {
        this.form.button1(text);
    }
    /**
     * @function send The sends the UI to a member
     * @param {string} player The member's you want to send it to
     * @param callback a asynchronous arrow function that will run after the form is filled out (Not fully if a model form).
     * @example .send('Mo9ses');
     * @returns {void}
     */
    async send(player, callback) {
        await this.form.show(player).then((res) => {
            if (!callback)
                return;
            callback(res, player);
        }).catch((err) => console.warn(err));
    }
}
/**
 * @class A Modal Form is a bit more advanced gametest UI that has sliders, text fields, ane much more, BUT NO BUTTONS!
 * @example const dc = new ModelForm(); dc.show('Mo9ses');
 * @returns Shows a simple ModalForm form to the player "Mo9ses"
 */
export class ModalForm {
    constructor() {
        this.form = new ModalFormData();
    }
    /**
     * @function setTitle Sets the title of the form
     * @param {string} text The title text
     * @example .setTitle('Server!');
     * @returns {void}
     */
    setTitle(text) {
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
    addInput(label, placeHolderText, defaultValue) {
        this.form.textField(label, placeHolderText ?? '', defaultValue ?? '');
    }
    /**
     * @function addDropdown Make a drop down menu to the form
     * @param {string} label the name of the drop down
     * @param {string[]} options The options in the drop down
     * @param {number} defaultValueIndex Where should the default value be when you first open the form
     * @example .addDropdown('Where do you live?', ['Mexico', 'America', 'Asia'], 1);
     * @returns {void}
     */
    addDropdown(label, options, defaultValueIndex) {
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
    addSlider(label, minimumValue, maximumValue, valueStep, defaultValue) {
        if (minimumValue > maximumValue)
            throw new Error('[Forms UI Silder] Error - the Min value cannot be greater than the Max value');
        this.form.slider(label, minimumValue, maximumValue, valueStep ?? 1, defaultValue ?? ~~(maximumValue / minimumValue));
    }
    /**
     * @function addToggle Adds a on/off button to the form
     * @param {string} label Then name of the toggle switch
     * @param {boolean} defaultValue Be either on or off when they first open the form
     * @example .addToggle('Cheese?');
     * @returns {void}
     */
    addToggle(label, defaultValue) {
        this.form.toggle(label, defaultValue ?? false);
    }
    /**
     * @function send The sends the UI to a member
     * @param {string} player The member's you want to send it to
     * @param callback a asynchronous arrow function that will run after the form is filled out (Not fully if a model form).
     * @example .send('Mo9ses');
     * @returns {void}
     */
    async send(player, callback) {
        await this.form.show(player).then((res) => {
            if (!callback)
                return;
            callback(res, player);
        }).catch((err) => console.warn(err));
    }
}
