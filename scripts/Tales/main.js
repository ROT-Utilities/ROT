export const listeners = [];
export function addListener(event, callback) {
    listeners.push([event, callback]);
}
