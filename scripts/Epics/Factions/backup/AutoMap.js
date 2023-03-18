import { system, world } from "@minecraft/server";
import quick from "../../../main";
import Player from "../../../Papers/PlayerPaper";
import { AsciiMap } from "../AsciiMap";
const config = quick.epics['Factions'];
system.runSchedule(() => {
    for (const plr of world.getPlayers()) {
        if (!Player.read(plr, 'autoMap'))
            continue;
        Player.send(plr, `Claims near you:\n§a${AsciiMap(plr)}`, 'FACTIONS', true);
    }
}, config.automapInterval);
