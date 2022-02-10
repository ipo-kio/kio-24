import {KioTaskSettings} from "../KioApi";

export class Settings {
    readonly level: number;
    CAR_MAX_FUEL: number = 100;
    FUEL_PER_UNIT: number = 10;

    constructor(settings: KioTaskSettings) {
        this.level = +settings.level;
    }
}
