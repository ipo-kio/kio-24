import './jeep.scss'
import {KioApi, KioTask, KioParameterDescription, KioResourceDescription, KioTaskSettings} from "../KioApi";
import {Settings} from "./Settings";
import {LinearField} from "./Field";
import {FieldState} from "./FieldState";

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

        domNode.innerHTML = `
            <canvas
                style="display: inline-block"
                width="600" height="600"
                class="task-canvas"
            ></canvas><div
                class="task-history"
                style="overflow: scroll; display: inline-block; width:300px; height: 600px"
            ></div>`;
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
