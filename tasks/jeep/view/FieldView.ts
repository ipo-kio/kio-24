import {Position} from "../model/Position";
import {FieldState} from "../model/FieldState";
import {Field} from "../model/Field";

export class FieldView {
    private field: Field;
    private position_click_action: (p: Position) => void;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private _highlighted_position: number = -1;
    private _field_state: FieldState = null;
    private _highlighted_circle_center: Position = null;
    private _highlighted_circle_radius: number = 0;

    private _d: number; // cell size
    private _r: number; // barrel rotation
    private x_scale: number = 1;

    math_2_scaled([x, y]: [number, number]): [number, number] {
        return [x * this.x_scale, y];
    }

    scaled_2_math([x, y]: [number, number]): [number, number] {
        return [x / this.x_scale, y];
    }

    constructor(field: Field, canvas: HTMLCanvasElement, position_click_action: (p: Position) => void) {
        this.field = field;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.position_click_action = position_click_action;

        let self = this;
        function position(evt: MouseEvent) {
            var rect = canvas.getBoundingClientRect(), // abs. size of element
                scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
                scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

            return self.scaled_2_math([
                (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
                (evt.clientY - rect.top) * scaleY    // been adjusted to be relative to element
            ]);
        }

        canvas.addEventListener('click', e => this._on_click(position(e)));
        canvas.addEventListener('mousemove', e => this._on_move(position(e)));

        //evaluate d, r
        let [x1, y1] = this.field.all_positions[0].point;
        let [x2, y2] = this.field.all_positions[1].point;
        let dx = x2 - x1;
        let dy = y2 - y1;
        this._d = Math.sqrt(dx * dx + dy * dy);
        this._r = Math.atan2(dy, dx);
    }

    set field_state(field_state: FieldState) {
        this._field_state = field_state;
        this.redraw();
    }

    private _on_click([x, y]: [number, number]) {
        let [xs, ys] = this.math_2_scaled([x, y]);
        for (let i = 0; i < this.field.size; i++) {
            this.mark_area(i);
            if (this.ctx.isPointInPath(xs, ys)) {
                let position = this.field.all_positions[i];
                this.position_click_action(position);
                return;
            }
        }
    }

    private _on_move([x, y]: [number, number]) {
        let was_highlighted = this._highlighted_position;
        let [xs, ys] = this.math_2_scaled([x, y]);

        let position_found = false;
        for (let i = 0; i < this.field.size; i++) {
            this.mark_area(i);
            if (this.ctx.isPointInPath(xs, ys)) {
                this._highlighted_position = i;
                position_found = true;
                break;
            }
        }
        if (!position_found)
            this._highlighted_position = -1;

        //don't highlight out of circle
        if (this._highlighted_position > -1) {
            let hp = this.field.all_positions[this._highlighted_position];
            let distance = this._highlighted_circle_center.distance(hp);
            let need_fuel = distance * this.field.jeep.constants.FUEL_PER_UNIT
            if (need_fuel > this._highlighted_circle_radius)
                this._highlighted_position = -1;
        }

        if (this._highlighted_position != was_highlighted)
            this.redraw();
    }

    protected mark_area(ind: number): void {
        let [x0, y0] = this.math_2_scaled(this.field.all_positions[ind].point);
        let c = this.ctx;
        c.save();
        c.translate(x0, y0);
        c.rotate(this._r);
        c.beginPath();
        let r = 20;
        c.rect(-r,  -r, r * 2, r * 2);
        c.restore();
    }

    redraw() {
        this.ctx.save();

        this.draw_bg();

        let field_state = this._field_state;
        if (field_state) {
            this.draw_values(field_state);

            //if highlighted
            if (this._highlighted_position >= 0) {
                this.mark_area(this._highlighted_position);
                this.ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
                this.ctx.fill();
            }

            this.draw_car(field_state);
        }

        if (this._highlighted_circle_center) {
            //draw reachable radius
            // this.ctx.moveTo(0, 0);
            // this.ctx.lineTo(this.canvas.width, 0);
            // this.ctx.lineTo(this.canvas.width, this.canvas.height);
            // this.ctx.lineTo(0, this.canvas.height);
            // this.ctx.lineTo(0, 0);

            let [x, y] = this.math_2_scaled(this._highlighted_circle_center.point);
            let radius = this._highlighted_circle_radius / this.field.jeep.constants.FUEL_PER_UNIT * this._d * this.x_scale;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 2 * Math.PI, 0, true);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.strokeStyle = 'green';
            this.ctx.fill();
            this.ctx.setLineDash([5, 5]);
            this.ctx.stroke();

            //TODO draw car in the center of circle
        }

        this.ctx.restore();
    }

    private draw_bg() {
        // let bg = this.jeep.kioapi.getResource('sand') as HTMLImageElement;
        // this.ctx.drawImage(bg, 0, 0, this.width, this.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private draw_values(field_state: FieldState) {
        let c = this.ctx;
        c.save();
        let barrel = this.field.jeep.kioapi.getResource('barrel')  as HTMLImageElement;

        let positions = this.field.all_positions;

        for (let i = 0; i < this.field.size; i++) {
            let fuel = field_state.get_value(i);
            // if (fuel == 0)
            //     continue;
            let text = fuel > 1e10 ? '∞' : '' + fuel;
            let [x, y] = this.math_2_scaled(positions[i].point);
            c.save();
            c.translate(x, y);
            c.rotate(this._r);

            const up = 40;

            /*this.ctx.strokeStyle = 'black';
            this.ctx.fillStyle = 'yellow';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 4, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();*/
            let cactus = this.field.jeep.kioapi.getResource('cactus') as HTMLImageElement;
            c.drawImage(cactus, -cactus.width / 2, -cactus.height / 2, cactus.width, cactus.height);
            c.font = '1em Arial';
            c.textAlign = "center";
            c.textBaseline = "top";
            c.fillStyle = 'yellow';
            c.fillText('' + i, 0, cactus.height / 2 + 4);

            if (fuel > 0) {
                c.font = '30px Arial';
                c.textAlign = "center";
                c.textBaseline = "middle";
                c.fillStyle = "orange";
                c.strokeStyle = 'black';
                c.drawImage(barrel, -barrel.width / 2, -barrel.height / 2 - up, barrel.width, barrel.height);

                c.strokeText(text, 0, -up);
                c.fillText(text, 0, -up);
            }

            c.restore();

            // this.mark_area(i);
            // this.ctx.stroke();
        }
        c.restore();
    }

    private draw_car(field_state: FieldState) {
        let jeep = this.field.jeep.kioapi.getResource('jeep') as HTMLImageElement;
        let [x, y] = this.math_2_scaled(field_state.car_position.point);

        let h = jeep.height;
        let w = jeep.width;
        let c = this.ctx;

        c.save();
        c.translate(x, y);
        c.rotate(this._r);
        let k = this._d / w * this.x_scale;
        c.drawImage(jeep, 0, 0, w, h, - k * w / 2, - k * h / 2, k * w, k * h);
        c.restore();

        //draw fuel info
        c.save();
        c.translate(x, y);
        let up = 20;
        c.beginPath();

        let fw = 60;
        let fh = 8;
        c.strokeStyle = 'black';
        c.fillStyle = 'rgba(255, 28, 0, 0.9)';
        c.rect(-fw/2-0.5, up-0.5, fw * field_state.car_fuel / this.field.jeep.constants.CAR_MAX_FUEL, fh);
        c.fill();
        c.beginPath();
        c.rect(-fw/2, up-0.5, fw, fh);
        c.stroke();

        //draw fuel text
        let text = '' + field_state.car_fuel;
        c.font = '30px Arial';
        c.textAlign = "center";
        c.textBaseline = "top";
        c.strokeStyle = 'black';
        c.fillStyle = 'yellow';
        c.strokeText(text, 0, up + fh);
        c.fillText(text, 0, up + fh);
        c.restore();
    }

    set_highlighted_circle(center: Position, radius: number): void {
        this._highlighted_circle_center = center;
        this._highlighted_circle_radius = radius;
        this.redraw();
    }

    set width(width: number) {
        this.canvas.width = width;
        let [x1, y1] = this.field.all_positions[0].point;
        let [x2, y2] = this.field.all_positions[this.field.size - 1].point;
        let w = x1 + x2;
        this.x_scale = width / w;
        this.redraw();
    }
}
