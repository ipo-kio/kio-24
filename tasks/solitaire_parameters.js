function Solitaire(settings) {
}

Solitaire.prototype.parameters = function () {
    return [
        {
            name: "isReady",
            title: "Собран ли пасьянс",
            ordering: "maximize",
            view: function (v) {
                if (+v > 0) return "Да"; else return "Нет";
            },
        },
        {
            name: "progress",
            title: "Беспорядки",
            ordering: "minimize",
            view: "",
        },
        {
            name: "length",
            title: "Длина перемещений",
            ordering: "minimize",
            view: "",
        },
        {
            name: "steps", //название параметра
            title: "Шаги", //отображение названия для пользователя
            ordering: "minimize", // 'maximize' - надо как можно больше, 'minimize' - как можно меньше
            view: "",
        },
        {
            name: "drops", //название параметра
            title: "Сбросы на пустые клетки", //отображение названия для пользователя
            ordering: "minimize", // 'maximize' - надо как можно больше, 'minimize' - как можно меньше
            view: "",
        },
    ];
};

var solitaire_parameters = {
    Solitaire: Solitaire
}