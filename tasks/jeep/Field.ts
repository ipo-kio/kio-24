import {Settings} from "./Settings";
import {FieldState} from "./FieldState";

type Point = [x: number, y: number];

export abstract class Field {
    public readonly settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;
    }

    abstract distance(position1: number, position2: number): number;

    abstract get size(): number;
}

export class LinearField extends Field {
    private ctx: CanvasRenderingContext2D;
    private start: Point;
    private finish: Point;
    private steps: number;
    private width: number;
    private height: number;
    private cell_radius: number;

    constructor(ctx: CanvasRenderingContext2D, settings: Settings, start: Point, finish: Point, steps: number, width: number, height: number) {
        super(settings);
        this.ctx = ctx;
        this.start = start;
        this.finish = finish;
        this.steps = steps;
        this.width = width;
        this.height = height;

        this.cell_radius = 10; // TODO evaluate cell radius from somewhere
    }

    draw(field_state: FieldState) {
        this.draw_bg();
        this.draw_values(field_state);
        this.draw_car(field_state);
    }

    private draw_bg() {
        this.ctx.fillStyle = '#ffd739';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    private draw_values(field_state: FieldState) {
    }

    private draw_car(field_state: FieldState) {

    }

    private get_point(ind: number): Point {
        let [x1, y1] = this.start;
        let [x2, y2] = this.finish;

        let dx = x2 - x1;
        let dy = y2 - y1;

        let vx = dx / (this.steps + 1);
        let vy = dy / (this.steps + 1);

        return [x1 + vx * ind, x2 + vy * ind];
    }

    private mark_area(ind: number): void {
        let [x0, y0] = this.get_point(ind);
        let c = this.ctx;
        c.beginPath();
        let r = this.cell_radius;
        c.rect(x0 - r, y0 - r, r * 2, r * 2);
    }

    distance(position1: number, position2: number): number {
        return Math.abs(position1 - position2) * this.settings.FUEL_PER_UNIT;
    }

    get size(): number {
        return this.steps;
    }
}


// ТИМОША
