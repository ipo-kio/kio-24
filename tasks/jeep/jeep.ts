import './jeep.scss'
import {KioApi, KioTask, KioParameterDescription, KioResourceDescription, KioTaskSettings} from "../KioApi";
import {Settings} from "./Settings";
import {LinearField} from "./Field";
import {FieldState} from "./FieldState";
import {History, MoveTo, Pick, Put} from "./Step";
import {HistoryView} from "./view/HistoryView";

export class Jeep implements KioTask {
    private _settings: Settings;
    private _kioapi: KioApi;
    private domNode: HTMLElement;

    constructor(settings: KioTaskSettings) {
        this._settings = new Settings(settings);
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
        canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height);

        console.log('problem level is', this._settings.level);

        let field = new LinearField(
            canvas.getContext('2d'),
            this,
            [50, 550],
            [550, 50],
            10,
            600,
            600
        );
        field.draw(FieldState.create(field));

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
            {id: "barrel", src: "jeep-resources/SteelBarrel.png"}
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
