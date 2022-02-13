import {FieldState} from "../model/FieldState";
import {Jeep} from "../jeep";
import {LinearPosition, Point, Position} from "../model/Position";

export abstract class Field {
    public readonly jeep: Jeep;
    protected _all_positions: Position[];
    protected position_click_action: (p: Position) => void;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected _highlighted_position: number = -1;
    protected _reachable_radius: number = 0;
    private _field_state: FieldState = null;

    constructor(canvas: HTMLCanvasElement, jeep: Jeep, position_click_action: (p: Position) => void) {
        this.jeep = jeep;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.position_click_action = position_click_action;

        function position(evt: MouseEvent) {
            var rect = canvas.getBoundingClientRect(), // abs. size of element
                scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
                scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

            return {
                x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
                y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
            }
        }

        canvas.addEventListener('click', e => this._on_click(position(e)));
        canvas.addEventListener('mousemove', e => this._on_move(position(e)));
    }

    abstract get size(): number;

    abstract get initial_position(): Position;

    protected abstract redraw(): void;

    get all_positions(): Position[] {
        return this._all_positions;
    }

    get field_state(): FieldState {
        return this._field_state;
    }

    set field_state(value: FieldState) {
        this._field_state = value;
        this.redraw();
    }

    get reachable_radius(): number {
        return this._reachable_radius;
    }

    set reachable_radius(value: number) {
        this._reachable_radius = value;
        this.redraw();
    }

    private _on_click({x, y}: {x: number, y: number}) {
        for (let i = 0; i < this.size; i++) {
            this.mark_area(i);
            if (this.ctx.isPointInPath(x, y)) {
                let position = this._all_positions[i];
                this.position_click_action(position);
                return;
            }
        }
    }

    private _on_move({x, y}: {x: number, y: number}) {
        let was_highlighted = this._highlighted_position;

        let position_found = false;
        for (let i = 0; i < this.size; i++) {
            this.mark_area(i);
            if (this.ctx.isPointInPath(x, y)) {
                this._highlighted_position = i;
                position_found = true;
                break;
            }
        }
        if (!position_found)
            this._highlighted_position = -1;

        if (this._highlighted_position != was_highlighted)
            this.redraw();
    }

    protected mark_area(ind: number): void {
        let [x0, y0] = this.all_positions[ind].point;
        let c = this.ctx;
        c.beginPath();
        let r = 10;
        c.rect(x0 - r, y0 - r, r * 2, r * 2);
    }
}

export class LinearField extends Field {
    private readonly _start: Point;
    private readonly _finish: Point;
    private readonly steps: number;
    private readonly width: number;
    private readonly height: number;
    private readonly cell_radius: number;
    private step_length: number;

    constructor(canvas: HTMLCanvasElement, jeep: Jeep, start: Point, finish: Point, steps: number, width: number, height: number, position_click_action: (p: Position) => void) {
        super(canvas, jeep, position_click_action);
        this._start = start;
        this._finish = finish;
        this.steps = steps;
        this.width = width;
        this.height = height;

        let [x1, y1] = this._start;
        let [x2, y2] = this._finish;

        let dx = x2 - x1;
        let dy = y2 - y1;
        this.step_length = Math.sqrt(dx * dx + dy * dy) / (steps + 1);

        // create all_positions
        this._all_positions = [];
        for (let i = 0; i < this.size; i++)
            this._all_positions.push(new LinearPosition(this, i));
    }

    redraw() {
        this.ctx.save();

        this.draw_bg();

        let field_state = this.field_state;
        if (field_state) {
            this.draw_values(field_state);
            this.draw_car(field_state);

            //draw reachable radius
            // this.ctx.moveTo(0, 0);
            // this.ctx.lineTo(this.canvas.width, 0);
            // this.ctx.lineTo(this.canvas.width, this.canvas.height);
            // this.ctx.lineTo(0, this.canvas.height);
            // this.ctx.lineTo(0, 0);
            let [x1, y1] = this.all_positions[0].point;
            let [x2, y2] = this.all_positions[1].point;
            let dx = x2 - x1;
            let dy = y2 - y1;
            let d = Math.sqrt(dx * dx + dy * dy);

            let [x, y] = field_state.car_position.point;
            let radius = field_state.car_fuel / 10 * d;
            // let radius = field_state.car_fuel / this.jeep.settings.FUEL_PER_UNIT * d;
            console.log('fs', field_state.car_fuel, d, radius, this.jeep.settings);
            this.ctx.arc(x, y, radius, 2 * Math.PI, 0, true);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.strokeStyle = 'green';
            this.ctx.fill();
            this.ctx.setLineDash([5, 5]);
            this.ctx.stroke();
        }

        //if highlighted
        if (this._highlighted_position >= 0) {
            this.mark_area(this._highlighted_position);
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
            this.ctx.fill();
        }

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

            this.mark_area(i);
            this.ctx.strokeStyle = 'black';
            this.ctx.stroke();
        }
    }

    private draw_car(field_state: FieldState) {

    }

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
}
