import LogicSim from "./src/LogicSim";


export class Logicsim {

    constructor(settings) {
        this.settings = settings;
        this.logicSim = undefined;
    }

    id = function () {
        return "logicsim";
    };

    initialize = (domNode, kioapi, preferred_width) => {
        //сохраняем данные для будущего использования
        this.kioapi = kioapi;
        this.domNode = domNode;

        const container = document.createElement("div")
        container.style.height = "600px"
        this.domNode.appendChild(container)

        this.logicSim = new LogicSim(container, 0, this.onSubmitResult, false)
    };

    parameters = function () {

        return [
            {
                name: "passedFraction",
                title: "Процент успешных тестов",
                ordering: "maximize",
                view: "",
            },
            {
                name: "elementsUsed",
                title: "Использовано элементов",
                ordering: "minimize",
                view: "",
            }
        ];
    };

    onSubmitResult = (res) => {
        this.kioapi.submitResult(res)
    }
//

//      * Ресурсы (изображения, звуки) должны находиться в каталоге с именем `[id-задачи]-resources`.
//      * Webpack настроен так, что он целиком копирует этот каталог в каталог dist с результатом.
//      *
//      * В общем случае, путь до ресурса считается от js-файла с задачей. Но т.к. все ресурсы находятся в каталоге
//      * `[id-задачи]-resources`, надо указывать этот каталог в пути.
//      * @returns [{id: String, src: String}]
//      */
//     static preloadManifest = function () {
//         return [];
//     };
//
//     /**
//      * Возвращает текущее решение в виде объекта,
//      * он будет сериализован с помощью JSON.stringify для хранения и передачи по сети, поэтому он должен содержать только
//      * строки, числа, массивы, внутренние объекты.
//      */
    solution = () => {
        return {}
    };
//
//     /**
//      * Загрузка решения в задачу. В качестве аргумента solution будет передан объект, который
//      * до этого был сформирован в методе solution. При загрузке решения нужно обновить данные через kioapi.submitResult
//      * @param solution решение для загрузки
//      */
    loadSolution = function (solution) {

    };
//
}
