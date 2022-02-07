export interface Step {}

export class MoveTo implements Step {
    private readonly _x: number;

    constructor(x: number) {
        this._x = x;
    }

    get x(): number {
        return this._x;
    }
}

export class Pick implements Step {
    private readonly _amount: number;

    constructor(amount: number) {
        this._amount = amount;
    }

    get amount(): number {
        return this._amount;
    }
}

export class Put implements Step {
    private readonly _amount: number;

    constructor(amount: number) {
        this._amount = amount;
    }

    get amount(): number {
        return this._amount;
    }
}

export class History {
    private _steps: Step[];
}
