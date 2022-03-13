import save from "./js/storage/save";
import Store from "./js/Store";
import recover from "./js/storage/recover";
import analyze from "./js/analyzeGraph/analyze";
import CNV from "./js/CNV/library";

import "./css/style.scss"
import css from "./js/css";
import {
    setAllEndCircleClick,
    resetAllEndCircleClick,
} from "./js/eventHandlers";
import {removeEdge, createEdge} from "./js/graphHandlers";
import drawingLine from "./js/drawingLine";
import {shiftDownHandler} from "./js/shiftHandlers";

import store from "./js/Store";
import zHandlers from "./js/zHandlers";
import SETTINGS from "./js/SETTINGS";
import firstDraw from "./js/firstDraw";
import UIhandlers from "./js/UI";

class Streams {
    constructor(settings) {
        Store.API = this;

        if ('level' in settings) {
            let level = +settings.level;
            switch (level) {
                case 0:
                    settings.NUMERIC_POWER = true;
                    settings.START_POWER = 274;
                    settings.LOOPS = false;
                    settings.MERGES = true;
                    settings.ALLOW_COLLISIONS = true;
                    settings.TASK = ['' + 215, '' + (274 - 215)];
                    break;
                case 1:
                    settings.TASK = ["13/27", "14/27"];
                    break;
                case 2:
                    settings.TASK = ["19/53", "34/53"];
                    break;
            }
        }

        this.settings = settings;
        console.log('settings', settings);
    }
    id(){
        return "streams" + this.settings.level;
    }
    initialize(domNode, kioapi, preferred_width){
        this.kioapi = kioapi;
        this.domNode = domNode;
        console.log("before SET", SETTINGS.getAll().NUMERIC_POWER);
        SETTINGS.set(this.settings);
        console.log("after SET", SETTINGS.getAll().NUMERIC_POWER);


        //---------------------------- copy from streams.js

        const { BRANCHES, LINE_WIDTH, STACK_LIMIT, SHOW_PATH,
            CONTROL_SUM_WARNING, STACK, SHOW_CYCLES, SHOW_PRIORITIES,
            START_POWER, NUMERIC_POWER, LINE_DIVISION, LINE_WIDTH_MIN,
            LOOPS, MERGES, FINISH_LIMITS  } = SETTINGS.getAll();

        domNode.innerHTML = `
                            <div class="dark hidden"></div>

                            <canvas id="canvas">
                            </canvas>
                            
<!--                            <button id="btn_award" class="btn_reset">-->
<!--                                <i class="fas fa-award"></i>-->
<!--                            </button>-->
<!--                            <button id="btn_info" class="btn_reset hidden">-->
<!--                                <i class="fas fa-info"></i>-->
<!--                            </button>-->
<!--                            <button id="btn_save" class="btn_reset">-->
<!--                                <i class="fas fa-save"></i>-->
<!--                            </button>-->
                            <button id="btn_pen" class="btn_reset pen_active">
                                Строить
                                <i class="fas fa-pen"></i>
                            </button>
                            <button id="btn_delete" class="btn_reset">
                                Удалить
                                <i class="fas fa-backspace"></i>
                            </button>
                            <button id="btn_prev" class="btn_reset">
                                Назад
                            </button>
                            <button id="btn_next" class="btn_reset">
                                Вперед
                            </button>
                            
                            <div class="warning hidden">
                            
                            </div>
                            
                            <div class="setting_warning hidden">
                                <ul id="setting_list"></ul>
                            </div>
                            <!--<h2 id="mode">Режим: рисование</h2>-->
                            <input class="saved_code">
                            <!--<button id="delLine">Удалить линию</button>-->
<!--                            <button id="save">Скопировать код</button>-->
<!--                            <input id="recover_input" placeholder="Вставить код">-->
<!--                            <button id="recover_btn">Восстановить</button>-->
<!--                            <input class="saved_code">-->

                    `;


        const canvas = document.querySelector("#canvas");

        const saveBtn = document.querySelector("#save");
        const recoverInput = document.querySelector("#recover_input");
        const recoverBtn = document.querySelector("#recover_btn");
        const savedCodeField = document.querySelector(".saved_code");
        const KIOcontainer = document.querySelector(".kio-base-info-panels-container");
        const KIOsaves = document.querySelector(".kio-base-solutions-container");
        let context = canvas.getContext("2d");
        KIOsaves.id = "KIOsaves";

        window.onresize = (e) => {
            canvas.width = document.documentElement.clientWidth;
            canvas.height = window.innerHeight - KIOcontainer.getBoundingClientRect().height - 40;
            CNV.render();
        }

        window.onload = e => {
            canvas.width = document.documentElement.clientWidth;
            canvas.height = window.innerHeight - KIOcontainer.getBoundingClientRect().height - 40;
        }


        //Инициализация библиотеки CNV

        //Базовая настройка
        CNV.setContext(context);
        CNV.setCanvas(canvas);
        CNV.setCSS(css);
        CNV.settings.draggableCanvas = false;
        CNV.settings.draggableCanvasObserver = (x, y) => {
            canvas.style.backgroundPositionY = y + "px";
            canvas.style.backgroundPositionX = x + "px";
        };

        canvas.addEventListener("click", e => {
            if(window.pageYOffset !== 0) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#canvas").offset().top
                }, 300);
            }
        })

        //запуск
        CNV.start();

        //Инициализация store
        store.setCanvas(canvas);
        store.setContext(context);

        firstDraw(canvas);

        //TODO initialization was here

        UIhandlers();

        /*const saveBtn = document.querySelector("#save");
        const recoverInput = document.querySelector("#recover_input");
        const recoverBtn = document.querySelector("#recover_btn");
        const savedCodeField = document.querySelector(".saved_code");

        recoverBtn.onclick = e => {
            recover(recoverInput.value);
            analyze(store.state.lines);
            recoverInput.value = ""
        }

        saveBtn.onclick = e => {
            saveBtn.classList.remove("saveOk");
            const disk = save({dont_save: true});

            savedCodeField.value = disk;
            savedCodeField.select();

            document.execCommand("copy");
            saveBtn.classList.add("saveOk");
            setTimeout(()=> {
                saveBtn.classList.remove("saveOk");
            }, 1000)
        }
        */
        window.addEventListener("keydown", shiftDownHandler);


        zHandlers();

        "Object { number_of_branches: 0, number_of_plots: 0, number_of_mergers: 0, number_of_loops: 0 }"
        //-----------------------------end copy from streams.js
    }
    parameters() {
        console.log("params");
        let number_of_branches = {
            name: "number_of_branches", //название параметра
            title: "Количество делений потка: ", //отображение названия для пользователя
            ordering: 'minimize', // 'maximize' - надо как можно больше, 'minimize' - как можно меньше
            view: "", // отображение значения параметра пользователю. Можно не указывать.
                      // Если задана строка, как в этом примере, она означает постфикс, т.е. если значение
                      // параметра равно, например, 42, пользователь увидит 42ш.
                      // Либо это может быть функция от одного аргумента, значения параметра, она
                      // должна возвращать строку для отображения пользователю,
        };
        let number_of_finish = {
            name: "number_of_finish",
            title: "Количество стоков: ",
            ordering: 'minimize',
        };
        let number_of_loops = {
            name: "number_of_loops",
            title: "Количество петель: ",
            ordering: 'minimize',
        };
        let number_of_merges = {
            name: "number_of_mergers",
            title: "Количество слияний: ",
            ordering: 'minimize',
        };
        let number_of_results = {
            name: "number_of_results",
            title: "Результат: ",
            ordering: 'maximize',
            view: "%"
        };
        let number_of_collisions = {
            name: "number_of_collision",
            title: "Пересечений: ",
            ordering: 'minimize',
            view: ""
        };

        const params = [];

        params.push(number_of_branches, number_of_finish);
        let loops = true;
        //TODO неудобно доставать данные из settings, сначала их надо обработать. Сейчас есть обработка через глобальный SETTINGS, это не подходит для вызова через Java
        if ('LOOPS' in this.settings)
            loops = this.settings.LOOPS === 'true' || this.settings.LOOPS === true;
        if (loops)
            params.push(number_of_loops);
        params.push(number_of_merges, number_of_results);

        let show_number_of_collision = true;
        if ('SHOW_NUMBER_OF_COLLISION' in this.settings)
            show_number_of_collision = this.settings.SHOW_NUMBER_OF_COLLISION === 'true' || this.settings.SHOW_NUMBER_OF_COLLISION === true;
        if (show_number_of_collision)
            params.push(number_of_collisions);

        return params;
    };
    solution() {
        return save({dont_save: true});
    }
    loadSolution(solution) {
        //console.log("Store.API.emptySolution", Store.API.emptySolution);
        if(solution !== undefined){
            if(typeof solution === "string"){
                recover(solution);
                analyze(Store.state.lines)
                setTimeout(()=> {
                    CNV.render();
                }, 0);
                solution = JSON.parse(solution);
            }
            //console.log("loadSolution", solution);
            if(solution){
                this.kioapi.submitResult(solution);
            }
        }

    };
}

export default Streams;
