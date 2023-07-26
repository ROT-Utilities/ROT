import quick from "../quick.js";
export const listeners = [];
export function addListener(event, callback) {
    listeners.push([event, callback]);
}
export const orders = [];
export function vender(vender, callback) {
    orders.push([vender, callback]);
}
export function orderVender(vender, parameters) {
    const callbacks = orders.filter(o => o[0] === vender), values = [];
    for (let i = 0; i < callbacks.length; i++) {
        try {
            const value = callbacks[i][1](parameters);
            if (value)
                values.push(value);
        }
        catch (e) {
            console.warn(`One of the vendors "${vender}" had a error     ${e + e.stack}`);
            quick.logs.errors.push(`One of the vendors "${vender}" had a error     ${e + e.stack}`);
        }
    }
    return values;
}
