import quick from "../../quick";
const ac = quick.epics.Automod;
(async () => {
    await Object.keys(ac.automod).forEach((E) => {
        if (!ac.automod[E])
            return;
        import(`./protections/${E}.js`).catch(e => {
            console.warn(`Failed to import protection "${E}"     ${e}: ${e.stack}`);
            quick.logs.errors.push(`${e} : ${e.stack}`);
        });
    });
})();
