import {Step} from "./Step";

export class History {
    private _steps: Step[];

    constructor(steps: Step[]) {
        this._steps = steps;
    }

    get steps(): Step[] {
        return this._steps;
    }
}
