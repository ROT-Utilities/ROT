export const staticBook = {
    create: {
        des: 'Create method, IDK',
        val: ['create', 'c-', 'make', 'new', 'm-'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    delyeet: {
        des: 'Deletes stuff',
        val: ['delete', 'delyeet', 'd-', 'yeet'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    add: {
        des: 'Adds stuff',
        val: ['add', 'a-', 'push'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    remove: {
        des: 'Removes stuff',
        val: ['remove', 'r-', 'rem', 're'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    save: {
        des: 'Saves stuff?',
        val: ['save', 's-', 'memory', 'sav'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    list: {
        des: '',
        val: ['list', 'l-', 'lis', 'tell'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    },
    sell: {
        des: '',
        val: [`sell`, 's-'],
        con: (val) => val /* You can write code here to make sure it's a Minecraft item without writing it every time inside a commond*/,
        err: 'That is not a Minecraft item'
    },
    teleport: {
        des: '',
        val: ['tp', 'teleport', 'go', 'go-to'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    send: {
        des: '',
        val: ['send'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    accept: {
        des: '',
        val: ['accept', 'ac', 'ok'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    decline: {
        des: '',
        val: ['deny', 'decline', 'no'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    play: {
        des: '',
        val: ['play', 'p', 'start', 'st'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    },
    try: {
        des: '',
        val: ['try', 'tryo', 'tr'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    },
    quit: {
        des: '',
        val: ['quit', 'q', 'qu'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    },
    set: {
        des: '',
        val: ['set', 'push', 'put'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    },
    toggle: {
        des: '',
        val: ['toggle', 'enable', 'disable', 'on', 'off'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    },
    rename: {
        des: '',
        val: ['rename', 'name', 'rn', 'rname'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    }
} /* as { [key: string]: { des: string, val: string[], con?: (val: string) => boolean, err?: string }}*/;
export const typeBook = {};
export const staticKeys = Object.keys(staticBook), staticValues = staticKeys.map((key) => staticBook[key].val).flat();
