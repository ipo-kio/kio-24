function Steiner(settings) {
}

Steiner.prototype.parameters = function () {
  return [{
    name: "connected",
    title: "Соединены ли точки",
    ordering: "maximize",
    view: function (value) {
      return value ? "Да" : "Нет";
    },
  }, {
    name: "segmentsLength",
    title: "Сумма длин отрезков",
    ordering: "minimize",
    view: ""
  }, {
    name: "numConjunctions",
    title: "Количество перекрестков",
    ordering: "minimize",
    view: ""
  }];
};

var steiner_parameters = {
  Steiner: Steiner
}
