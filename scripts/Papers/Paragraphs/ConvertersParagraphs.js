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
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*****************************************************
* This will display in text in thousands, millions and etc... For ex: "1400 -> "1.4k", "1000000" -> "1M", etc...
* @param {number} number The number you want to convert
* @returns {string}
* @example metricNumbers(15000);
*/
export const metricNumbers = (value, fixed) => {
    const types = ["", "k", "M", "B", "T", "QT", "ST", "Z", "Y"], selectType = Math.log10(value) / 3 | 0;
    if (selectType == 0)
        return value;
    let scaled = value / Math.pow(10, selectType * 3);
    return scaled.toFixed(fixed ?? 3) + types[selectType];
}, 
/**
* Convert string to hex
* @param {string} text
* @returns {number[]}
*/ // @ts-ignore
textToAscii = (text) => text.split('').map(char => char.charCodeAt(undefined)), 
/**
* Convert hex to string
* @param {number} hex
* @returns {string}
*/
asciiToText = (hex) => hex.map(char => String.fromCharCode(char)).join(''), 
/**
 * Conver decimal to hex
 * @param {number} decimal
 * @return {string}
 */
numberToHex = (decimal) => decimal.toString(16), 
/**
 * Convert hex to decimal
 * @param {string} hex
 * @returns {number}
 */
hexToNumber = (hex) => parseInt(hex, 16), 
/**
 * Convert numbers to the Alphabet!
 * @param {number} S
 * @returns {string}
 */
numberToAlphabet = (s) => {
    if (s >= 27)
        var ds = s % 26;
    else
        ds = s;
    if (s == 26)
        var ps = 0;
    else
        ps = s / 26;
    ps = ~~ps;
    if (1 == ds)
        var l = "a";
    if (2 == ds)
        l = "b";
    if (3 == ds)
        l = "c";
    if (4 == ds)
        l = "d";
    if (5 == ds)
        l = "e";
    if (6 == ds)
        l = "f";
    if (7 == ds)
        l = "e";
    if (8 == ds)
        l = "h";
    if (9 == ds)
        l = "i";
    if (10 == ds)
        l = "j";
    if (11 == ds)
        l = "k";
    if (12 == ds)
        l = "l";
    if (13 == ds)
        l = "m";
    if (14 == ds)
        l = "n";
    if (15 == ds)
        l = "o";
    if (16 == ds)
        l = "p";
    if (17 == ds)
        l = "q";
    if (18 == ds)
        l = "r";
    if (19 == ds)
        l = "s";
    if (20 == ds)
        l = "t";
    if (21 == ds)
        l = "u";
    if (22 == ds)
        l = "v";
    if (23 == ds)
        l = "w";
    if (24 == ds)
        l = "x";
    if (25 == ds)
        l = "y";
    if (26 == ds)
        l = "z";
    return ps == 0 ? l : `${ps}${l}`;
};
export const timeRegex = /^\d+\.?\d*\s?((years*?|yrs*?)|(weeks*?)|(days*?)|(hours*?|hrs*?)|(minutes*?|mins*?)|(seconds*?|secs*?)|(milliseconds*?|msecs*?|ms)|[smhdwy])(?!\S)(?=\s?)/;
export function MS(value, { compactDuration, fullDuration, avoidDuration } = {}) {
    try {
        if (typeof value === 'string') {
            if (/^\d+$/.test(value))
                return Number(value);
            const durations = value.match(/-?\d*\.?\d+\s*?(years?|yrs?|weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|milliseconds?|msecs?|ms|[smhdwy])/gi);
            return durations ? durations.reduce((a, b) => a + toMS(b), 0) : null;
        }
        if (typeof value === 'number')
            return toDuration(value, { compactDuration, fullDuration, avoidDuration });
        throw new Error('Value is not a string or a number');
    }
    catch (err) {
        const message = isError(err)
            ? `${err.message}. Value = ${JSON.stringify(value)}`
            : 'An unknown error has occured.';
        throw new Error(message);
    }
}
;
/**
 * Convert Durations to milliseconds
 */
const toMS = (value) => {
    const number = Number(value.replace(/[^-.0-9]+/g, ''));
    value = value.replace(/\s+/g, '');
    if (/\d+(?=y)/i.test(value))
        return number * 3.154e+10;
    if (/\d+(?=w)/i.test(value))
        return number * 6.048e+8;
    if (/\d+(?=d)/i.test(value))
        return number * 8.64e+7;
    if (/\d+(?=h)/i.test(value))
        return number * 3.6e+6;
    if (/\d+(?=m)/i.test(value))
        return number * 60000;
    if (/\d+(?=s)/i.test(value))
        return number * 1000;
    if (/\d+(?=ms|milliseconds?)/i.test(value))
        return number;
};
/**
 * Convert milliseconds to durations
 */
const toDuration = (value, { compactDuration, fullDuration, avoidDuration } = {}) => {
    const absMs = Math.abs(value);
    const duration = [
        { short: 'W', long: 'Week', duration: Math.floor(absMs / 6.048e+8) },
        { short: 'D', long: 'Day', duration: Math.floor(absMs / 8.64e+7) % 7 },
        { short: 'H', long: 'Hour', duration: Math.floor(absMs / 3.6e+6) % 24 },
        { short: 'M', long: 'Minute', duration: Math.floor(absMs / 60000) % 60 },
        { short: 'S', long: 'Second', duration: Math.floor(absMs / 1000) % 60 },
        { short: 'MS', long: 'Millisecond', duration: absMs % 1000 }
    ];
    const mappedDuration = duration
        .filter(obj => obj.duration !== 0 && avoidDuration ? fullDuration && !avoidDuration.map(v => v.toLowerCase()).includes(obj.short) : obj.duration)
        .map(obj => `${Math.sign(value) === -1 ? '-' : ''}${compactDuration ? `${Math.floor(obj.duration)}${obj.short}` : `${Math.floor(obj.duration)} ${obj.long}${obj.duration === 1 ? '' : 's'}`}`);
    const result = fullDuration ? mappedDuration.join(compactDuration ? ' ' : ', ') : mappedDuration[0];
    return result || `${absMs}`;
};
/**
 * A type guard for errors.
 */
const isError = (error) => {
    return typeof error === 'object' && error !== null && 'message' in error;
};
