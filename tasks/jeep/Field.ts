import {Settings} from "./Settings";
import {FieldState} from "./FieldState";
import {get} from "jquery";
import {Jeep} from "./jeep";
import {Position} from "./Step";

type Point = [x: number, y: number];

export abstract class Field {
    public readonly jeep: Jeep;

    constructor(jeep: Jeep) {
        this.jeep = jeep;
    }

    abstract distance(position1: number, position2: number): number;

    abstract get size(): number;

    abstract get initial_position(): Position;
}

export class LinearPosition implements Position {
    private readonly x: number;

    constructor(x: number) {
        this.x = x;
    }

    distance(other: Position): number {
        let o = other as LinearPosition;
        return Math.abs(o.x - this.x);
    }

    get text(): string {
        return "" + this.x;
    }

    get available(): boolean {
        return false;
    }

    get index(): number {
        return 0;
    }
}

export class LinearField extends Field {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly start: Point;
    private readonly finish: Point;
    private readonly steps: number;
    private readonly width: number;
    private readonly height: number;
    private readonly cell_radius: number;
    private step_length: number;

    constructor(ctx: CanvasRenderingContext2D, jeep: Jeep, start: Point, finish: Point, steps: number, width: number, height: number) {
        super(jeep);
        this.ctx = ctx;
        this.start = start;
        this.finish = finish;
        this.steps = steps;
        this.width = width;
        this.height = height;

        this.cell_radius = 10; // TODO evaluate cell radius from somewhere

        let [x1, y1] = this.start;
        let [x2, y2] = this.finish;

        let dx = x2 - x1;
        let dy = y2 - y1;
        this.step_length = Math.sqrt(dx * dx + dy * dy) / (steps + 1);
    }

    draw(field_state: FieldState) {
        this.ctx.save();

        this.draw_bg();

        //convert image
        let [x1, y1] = this.start;
        let [x2, y2] = this.finish;
        this.ctx.translate(x1, y1);
        this.ctx.rotate(Math.atan2(y2 - y1, x2 - x1));

        this.draw_values(field_state);
        this.draw_car(field_state);

        this.ctx.restore();
    }

    private draw_bg() {
        this.ctx.fillStyle = '#ffd739';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    private draw_values(field_state: FieldState) {
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "top";
        this.ctx.fillStyle = "black";
        let barrel = this.jeep.kioapi.getResource('barrel')  as HTMLImageElement;

        for (let i = 0; i < this.steps; i++) {
            let fuel = field_state.get_value(i);
            // if (fuel == 0)
            //     continue;
            let text = fuel > 1e10 ? '∞' : '' + fuel;
            let [x, y] = [this.step_length * i, 0];
            this.ctx.drawImage(barrel, x - barrel.width / 2, y - barrel.height, barrel.width, barrel.height);
            this.ctx.fillText(text, x, y);
        }
    }

    private draw_car(field_state: FieldState) {

    }

    /*private get_point(ind: number): Point {
        let [x1, y1] = this.start;
        let [x2, y2] = this.finish;

        let dx = x2 - x1;
        let dy = y2 - y1;

        let vx = dx / (this.steps + 1);
        let vy = dy / (this.steps + 1);

        return [x1 + vx * ind, x2 + vy * ind];
    }*/

    /*private mark_area(ind: number): void {
        let [x0, y0] = this.get_point(ind);
        let c = this.ctx;
        c.beginPath();
        let r = this.cell_radius;
        c.rect(x0 - r, y0 - r, r * 2, r * 2);
    }*/

    distance(position1: number, position2: number): number {
        return Math.abs(position1 - position2) * this.jeep.settings.FUEL_PER_UNIT;
    }

    get size(): number {
        return this.steps;
    }

    get initial_position(): Position {
        return
    }
}
