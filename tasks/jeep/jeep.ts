import './jeep.scss'
import {KioApi, KioParameterDescription, KioResourceDescription, KioTask, KioTaskSettings} from "../KioApi";
import {Field, LinearField} from "./model/Field";
import {FieldState} from "./model/FieldState";
import {HistoryView} from "./view/HistoryView";
import {History} from "./model/History";
import {Slider} from './view/Slider';
import {Constants} from "./Constants";
import {FieldView} from "./view/FieldView";
import {Position} from "./model/Position";
import {MoveTo, PickOrPut, StepType} from "./model/Step";

export class Jeep implements KioTask {
    private readonly _constants: Constants;
    private _kioapi: KioApi;
    private domNode: HTMLElement;
    private level: number;

    private history: History;
    private field: Field;

    private field_view: FieldView;
    private history_view: HistoryView;
    private slider: Slider;

    constructor(settings: KioTaskSettings) {
        this._constants = new Constants(settings);

        this.field = new LinearField(
            this,
            [50, 550],
            [550, 50],
            10,
            600,
            600
        );
        let initial_state = FieldState.create(this.field);
        this.history = new History([], FieldState.create(this.field));

        this.level = settings.level ? 0 : +settings.level;
    }

    id(): string {
        return "jeep" + this.level;
    }

    initialize(domNode: HTMLElement, kioapi: KioApi, preferred_width: number) {
        console.log('preferred width in problem initialization', preferred_width);

        this._kioapi = kioapi;
        this.domNode = domNode;

        domNode.innerHTML = `<div style="background: url('jeep-resources/sand.jpg')">
                <canvas
                    style="display: inline-block; vertical-align: top"
                    width="600" height="600"
                    class="task-canvas"
                ></canvas><div style="display: inline-block; vertical-align: top">
                    <div class="task-history"></div>
                    <div class="task-controls" style="width: 300px; height:200px"></div>
                </div>
            </div>`;
        let canvas = domNode.getElementsByClassName('task-canvas')[0] as HTMLCanvasElement;
        let history = domNode.getElementsByClassName('task-history')[0] as HTMLDivElement;
        let controls = domNode.getElementsByClassName('task-controls')[0] as HTMLDivElement;
        canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height);

        this.slider = new Slider(
            -5,
            5,
            27 + 20 + 20,
            kioapi.getResource('slider'),
            kioapi.getResource('slider-hover'),
            kioapi.getResource('slider-line'),
            1
        );
        controls.appendChild(this.slider.canvas);
        this.slider.onvaluechange = (new_value: number) => this.fuel_value_change(new_value);
        this.slider.add_ticks(1, 10, '#e6ffe0', 17);
        this.slider.add_ticks(5, 15, '#e6ffe0');

        console.log('problem level is', this.level);

        this.field_view = new FieldView(this.field, canvas, (p: Position) => this.car_position_change(p));
        this.history_view = new HistoryView(history, this.history);
        this.history_view.add_listener(() => this.history_updated());

        this.field_view.field_state = this.history.state(0);
    }

    parameters(): KioParameterDescription[] {
        return [
            {
                name: "steps",
                title: "Количество шагов",
                ordering: 'maximize',
                view: "ш"
            },
            {
                name: "max",
                title: "Максимальное число",
                ordering: 'minimize',
                view: function (val) {
                    return '[' + val + ']'
                }
            }
        ];
    }

    get kioapi(): KioApi {
        return this._kioapi;
    }

    static preloadManifest(): KioResourceDescription[] {
        return [
            {id: "sand", src: "jeep-resources/sand.jpg"},
            {id: "jeep", src: "jeep-resources/SimpleGreenCarTopView.png"},
            {id: "barrel", src: "jeep-resources/SteelBarrel.png"},
            {id: 'slider', src: "jeep-resources/slider.png"},
            {id: 'slider-hover', src: "jeep-resources/slider-hover.png"},
            {id: 'slider-line', src: "jeep-resources/slider-line.png"}
        ];
    };

    solution(): Solution {
        return {};
    };

    loadSolution(solution: Solution): void {
    }


    get constants(): Constants {
        return this._constants;
    }

    // handlers

    fuel_value_change(new_value: number) {
        let current_step = this.history_view.current_step;
        let new_step = new PickOrPut(new_value);
        if (current_step != null && current_step.type == StepType.FUEL)
            this.history_view.update_current_step(new_step);
        else
            this.history_view.insert_next(new_step);
    }

    car_position_change(new_position: Position) {
        let current_step = this.history_view.current_step;
        let new_step = new MoveTo(new_position);
        if (current_step != null && current_step.type == StepType.DRIVE)
            this.history_view.update_current_step(new_step);
        else
            this.history_view.insert_next(new_step);
    }

    history_updated() {
        let current_index = this.history_view.current_index;
        let current_state = this.history.state(current_index + 1);
        let previous_state = this.history.state(current_index);
        this.field_view.field_state = current_state;
        console.log('current state:', current_state.str);

        this.slider.max_value = previous_state.possible_to_pick();
        this.slider.min_value = -previous_state.car_fuel;
    }
}

interface Solution {
}
