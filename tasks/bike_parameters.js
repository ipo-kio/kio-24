function Bike(settings) {
}

Bike.prototype.parameters = function () {
    return [
        {
            name: "res",
            title: "Результат вычислен",
            ordering: "maximize",
            view: function (v) {
                if (v > 0) return "да"; else return "нет"
            },
        },
        {
            name: "diffF",
            title: "Среднее отклонение скорости",
            ordering: "minimize",
            view: ""
        },
        {
            name: "maxSpeedDeviation",
            title: "Максимальное отклонение скорости",
            ordering: "minimize",
            view: ""
        }
    ];
};

var bike_parameters = {
    Bike: Bike
}