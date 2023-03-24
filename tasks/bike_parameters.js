function Bike(settings) {
}

Bike.prototype.parameters = function () {
    return [
        {
            name: "res",
            title: "Задача решена",
            ordering: "maximize",
            view: "",
        },
        {
            name: "diffF",
            title: "Среднее отклонение скорости",
            ordering: "minimize",
            view: "",
        },
        {
            name: "maxSpeedDeviation",
            title: "Максимальное отклонение скорости",
            ordering: "minimize",
            view: "",
        }
    ];
};

var bike_parameters = {
    Bike: Bike
}