import './collatz.scss'

export class Collatz_es_next {
    constructor(settings) {
        this.settings = settings;
    }

    id() {
        return "collatz_es_next" + this.settings.level;
    }

    initialize(domNode, kioapi, preferred_width) {
        console.log('preferred width in problem initialization', preferred_width);

        this.kioapi = kioapi;
        this.domNode = domNode;

        console.log('problem level is', this.settings.level);

        let $domNode = $(this.domNode);
        this.initInterface($domNode);
    }

    parameters() {
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
            },
            {
                name: "info1",
                title: "Информационный параметр",
                view: function (v) {
                    if (!v) v = 0;
                    return v.toFixed(2) + "%";
                },
                normalize: function (v) {
                    return 0;
                }
            }
        ];
    }

    static preloadManifest() {
        return [
            {id: "1", src: "collatz_es_next-resources/collatz_conjecture.png"}
        ];
    };

    solution() {
        let x = this.process == null ? 0 : this.process.x;
        return {x};
    };

    loadSolution(solution) {
        if (!solution || !solution.x)
            return;
        let x = solution.x;

        if (x <= 0 || x >= 1000)
            return;

        this.$input.val('' + x).change();
    }

    // private methods

    initInterface($domNode) {
        let $input_output_container = $("<div class='kio-collatz-input-output-wrapper'>");
        this.$input = $("<input class='number-input' size='3'>");
        this.$output = $("<textarea class='steps-view' readonly='readonly'></textarea>");
        let img = this.kioapi.getResource('1');
        img.className = 'kio-collatz-info-image';

        $domNode.append(img, $input_output_container);
        $input_output_container.append(this.$input, this.$output);

        let thisProblem = this;

        this.$input.change(function (evt) {
            let x = +thisProblem.$input.val();
            if (!x || x <= 0 || x >= 1000)
                thisProblem.process = null;
            else
                thisProblem.process = new ThreeXPlusOneProcess(x);

            if (thisProblem.process != null)
                thisProblem.kioapi.submitResult({
                    steps: thisProblem.process.length(),
                    max: thisProblem.process.max(),
                    info1: Math.random()
                });
            thisProblem.updateView();
        });

        this.loadSolution({x: 5});
    }

    updateView() {
        if (this.process == null)
            this.$output.text('Неверный ввод');
        else
            this.$output.text(this.process.steps.join(' -> ') + '\n\n' + this.process.max());
    };
}

class ThreeXPlusOneProcess {
    constructor(x) {
        this.x = x;
        this.steps = [x];
        while (x !== 1) {
            if (x % 2 === 0)
                x = x / 2;
            else
                x = 3 * x + 1;
            this.steps.push(x);
        }
    }

    length() {
        return this.steps.length;
    }

    max() {
        let max = 0;

        for (let i = 0; i < this.steps.length; i++)
            if (max < this.steps[i])
                max = this.steps[i];

        return max;
    }
}
