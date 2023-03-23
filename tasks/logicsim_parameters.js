function Logicsim(settings) {
}

Logicsim.prototype.parameters = function () {
    return [
        {
            name: "passedFraction",
            title: "Процент успешных тестов",
            ordering: "maximize",
            view: "%",
        },
        {
            name: "elementsUsed",
            title: "Использовано элементов",
            ordering: "minimize",
            view: "",
        }
    ];
};

var logicsim_parameters = {
    Logicsim: Logicsim
}