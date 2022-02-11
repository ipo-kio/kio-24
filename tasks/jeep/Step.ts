import {Point} from "./Field";

export interface Step {
    get text(): string;
    get value(): string | number;
}

export interface Position {
    get text(): string;
    distance(other: Position): number;
    get index(): number;
    get point(): Point;
}

export class MoveTo implements Step {
    private readonly _position: Position;

    constructor(position: Position) {
        this._position = position;
    }

    get position(): Position {
        return this._position;
    }

    get text(): string {
        return "Переместись в";
    }

    get value(): string | number {
        return this.position.text;
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

    get text(): string {
        return "Возьми топливо";
    }

    get value(): string | number {
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

    get text(): string {
        return "Оставь топливо";
    }

    get value(): string | number {
        return this._amount;
    }
}

export class History {
    private _steps: Step[];

    constructor(steps: Step[]) {
        this._steps = steps;
    }

    get steps(): Step[] {
        return this._steps;
    }
}
