import './jeep.scss'
import {KioApi, KioTask, KioParameterDescription, KioResourceDescription, KioTaskSettings} from "../KioApi";
import {Settings} from "./Settings";
import {LinearField} from "./view/Field";
import {FieldState} from "./model/FieldState";
import {MoveTo, Pick, Put} from "./model/Step";
import {HistoryView} from "./view/HistoryView";
import {History} from "./model/History";
import {Slider} from './view/Slider';

export class Jeep implements KioTask {
    private _settings: Settings;
    private _kioapi: KioApi;
    private domNode: HTMLElement;

    constructor(settings: KioTaskSettings) {
        this._settings = new Settings(settings);
        console.log('settings', this._settings.FUEL_PER_UNIT);
    }

    id() {
        return "jeep" + this._settings.level;
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

        let slider = new Slider(
            -5,
            5,
            27 + 20 + 20,
            kioapi.getResource('slider'),
            kioapi.getResource('slider-hover'),
            kioapi.getResource('slider-line'),
            1
        );
        controls.appendChild(slider.canvas);
        slider.onvaluechange = (new_value: number) => console.log("value", new_value);
        slider.add_ticks(1, 10, '#e6ffe0', 17);
        slider.add_ticks(5, 15, '#e6ffe0');

        console.log('problem level is', this._settings.level);

        let field = new LinearField(
            canvas,
            this,
            [50, 550],
            [550, 50],
            10,
            600,
            600,
            p => console.log(p)
        );
        field.field_state = FieldState.create(field);
        let next_state = field.field_state.pick(40);
        field.field_state = next_state;

        // create history

        let p = field.all_positions;
        let h = new History([
            new MoveTo(p[1]),
            new Pick(10),
            new MoveTo(p[2]),
            new Put(20)
        ]);
        let hw = new HistoryView(history, h);
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

    get settings(): Settings {
        return this._settings;
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
}

interface Solution {
}
