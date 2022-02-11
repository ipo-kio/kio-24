import {FieldState} from "./FieldState";
import {Jeep} from "./jeep";
import {Position} from "./Step";

export type Point = [x: number, y: number];

export abstract class Field {
    public readonly jeep: Jeep;

    constructor(jeep: Jeep) {
        this.jeep = jeep;
    }

    abstract get size(): number;

    abstract get initial_position(): Position;

    abstract get all_positions(): Position[]; // please don't modify {readonly [n: number]: Position, length: number};
}

export class LinearPosition implements Position {
    private readonly field: LinearField;
    private readonly ind: number;

    constructor(field: LinearField, ind: number) {
        this.field = field;
        this.ind = ind;
    }

    distance(other: Position): number {
        let o = other as LinearPosition;
        return Math.abs(o.ind - this.ind) * this.field.jeep.settings.FUEL_PER_UNIT;
    }

    get text(): string {
        return "" + this.ind;
    }

    get available(): boolean {
        return false;
    }

    get index(): number {
        return this.ind;
    }

    get point(): Point {
        let [x1, y1] = this.field.start;
        let [x2, y2] = this.field.finish;
        let n = this.field.size;
        let dx = x2 - x1;
        let dy = y2 - y1;
        let vx = dx / (n - 1);
        let vy = dy / (n - 1);
        return [x1 + this.ind * vx, y1 + this.ind * vy];
    }
}

export class LinearField extends Field {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly _start: Point;
    private readonly _finish: Point;
    private readonly steps: number;
    private readonly width: number;
    private readonly height: number;
    private readonly cell_radius: number;
    private step_length: number;

    constructor(ctx: CanvasRenderingContext2D, jeep: Jeep, start: Point, finish: Point, steps: number, width: number, height: number) {
        super(jeep);
        this.ctx = ctx;
        this._start = start;
        this._finish = finish;
        this.steps = steps;
        this.width = width;
        this.height = height;

        this.cell_radius = 10; // TODO evaluate cell radius from somewhere

        let [x1, y1] = this._start;
        let [x2, y2] = this._finish;

        let dx = x2 - x1;
        let dy = y2 - y1;
        this.step_length = Math.sqrt(dx * dx + dy * dy) / (steps + 1);
    }

    draw(field_state: FieldState) {
        this.ctx.save();

        this.draw_bg();

        //convert image
        let [x1, y1] = this._start;
        let [x2, y2] = this._finish;
        // this.ctx.translate(x1, y1);
        // this.ctx.rotate(Math.atan2(y2 - y1, x2 - x1));

        this.draw_values(field_state);
        this.draw_car(field_state);

        this.ctx.restore();
    }

    private draw_bg() {
        // let bg = this.jeep.kioapi.getResource('sand') as HTMLImageElement;
        // this.ctx.drawImage(bg, 0, 0, this.width, this.height);
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    private draw_values(field_state: FieldState) {
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "orange";
        this.ctx.strokeStyle = 'black';
        let barrel = this.jeep.kioapi.getResource('barrel')  as HTMLImageElement;

        let positions = this.all_positions;

        for (let i = 0; i < this.steps; i++) {
            let fuel = field_state.get_value(i);
            // if (fuel == 0)
            //     continue;
            let text = fuel > 1e10 ? '∞' : '' + fuel;
            let [x, y] = positions[i].point;
            this.ctx.drawImage(barrel, x - barrel.width / 2, y - barrel.height / 2, barrel.width, barrel.height);
            this.ctx.strokeText(text, x, y);
            this.ctx.fillText(text, x, y);
        }
    }

    private draw_car(field_state: FieldState) {

    }

    /*private mark_area(ind: number): void {
        let [x0, y0] = this.get_point(ind);
        let c = this.ctx;
        c.beginPath();
        let r = this.cell_radius;
        c.rect(x0 - r, y0 - r, r * 2, r * 2);
    }*/

    get size(): number {
        return this.steps;
    }

    get initial_position(): Position {
        return this.all_positions[0];
    }

    get start(): Point {
        return this._start;
    }

    get finish(): Point {
        return this._finish;
    }

    get all_positions(): Position[] {
        let positions: Position[] = [];
        for (let i = 0; i < this.size; i++)
            positions.push(new LinearPosition(this, i));
        return positions;
    }
}
