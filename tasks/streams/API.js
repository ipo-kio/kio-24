import save from "./js/storage/save";
import Store from "./js/Store";
import recover from "./js/storage/recover";
import analyze from "./js/analyzeGraph/analyze";
import CNV from "./js/CNV/library";


class Streams {
    constructor(settings) {
        Store.API = this;
        this.settings = settings;
    }
    id(){
        return "streams" + this.settings.level;
    }
    initialize(domNode, kioapi, preferred_width){
        this.kioapi = kioapi;
        this.domNode = domNode;
        let $domNode = $(this.domNode);
        this.initInterface($domNode);
    }
    parameters() {
        return [
            {
                name: "number_of_branches", //название параметра
                title: "Количество делений потка: ", //отображение названия для пользователя
                ordering: 'minimize', // 'maximize' - надо как можно больше, 'minimize' - как можно меньше
                view: "", // отображение значения параметра пользователю. Можно не указывать.
                          // Если задана строка, как в этом примере, она означает постфикс, т.е. если значение
                          // параметра равно, например, 42, пользователь увидит 42ш.
                          // Либо это может быть функция от одного аргумента, значения параметра, она
                          // должна возвращать строку для отображения пользователю,
            },
            {
                name: "number_of_finish",
                title: "Количество стоков: ",
                ordering: 'minimize',
            },
            {
                name: "number_of_loops",
                title: "Количество петель: ",
                ordering: 'minimize',
            },
            {
                name: "number_of_mergers",
                title: "Количество слияний: ",
                ordering: 'minimize',

            },
        ];
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


    initInterface($domNode) {
        //var $input_output_container = $("<div class='kio-collatz-input-output-wrapper'>");
        // this.$mode = $("<h2 id=\"mode\">Режим: рисование</h2>");
        // this.$delLine = $("<button id=\"delLine\">Удалить линию</button>");
        // this.$settings = $("<button id=\"settings\">Настройки</button>");
        // this.$saveBtn = $("<button id=\"save\">Сохранить и скопировать</button>");
        // this.$recoverBtn = $("<button id=\"recover\">Восстановить</button>");


        // this.$input = $("<input class='number-input' size='3'>");
        // this.$output = $("<textarea class='steps-view' readonly='readonly'></textarea>");

        //$domNode.append($input_output_container);
        //$input_output_container.append(this.$mode, this.$delLine, this.$settings, this.$saveBtn, this.$recoverBtn);

        //add image

        // this.$input.change(function (evt) {
        //     var x = +thisProblem.$input.val();
        //     if (!x || x <= 0 || x >= 1000)
        //         thisProblem.process = null;
        //     else
        //
        //
        //     if (thisProblem.process != null)
        //         //каждый раз при получении участником результата нужно делать submitResult и передавать объект с результатом
        //         //проверки.
        //         thisProblem.kioapi.submitResult({
        //             steps: thisProblem.process.length(),
        //             max: thisProblem.process.max(),
        //             info1: Math.random() // бессмысленный информационный параметр,
        //                                  // в реальной программе параметры должны быть детерминировны условием
        //         });
        // });

        //загружаем начальное решение. Это то решение, которое увидит участник, впервые открыв задачу
        // this.loadSolution({
        //     number_of_branches: 0,
        //     number_of_loops: 0,
        //     number_of_mergers: 0,
        // });
    };
}

export default Streams;



