import SETTINGS from "./js/SETTINGS";

class Streams {
    constructor(settings) {
        this.settings = settings;
    }

    parameters() {
        const params = [
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
            {
                name: "number_of_results",
                title: "Результат: ",
                ordering: 'maximize',
                view: "%"
            },
        ];

        if(this.settings.SHOW_NUMBER_OF_COLLISION){
            params.push(
                {
                    name: "number_of_collision",
                    title: "Пересечений: ",
                    ordering: 'minimize',
                    view: ""
                },
            )
        }

        return params;

    };

}
