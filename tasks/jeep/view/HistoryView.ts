import {History} from "../model/History";

export class HistoryView {

    private readonly _div: HTMLDivElement;
    private readonly _ol: HTMLOListElement = document.createElement('ol');
    private _history: History;

    constructor(div: HTMLDivElement, history: History) {
        this._div = div;
        this._div.appendChild(this._ol);
        this._history = history;
        this.update();
    }

    get div(): HTMLDivElement {
        return this._div;
    }

    get history(): History {
        return this._history;
    }

    set history(value: History) {
        this._history = value;
        this.update();
    }

    private update(): void {
        let steps = this._history.steps;
        this.ensure_sub_divs_length(steps.length);

        for (let i = 0; i < steps.length; i++) {
            let step = steps[i];
            let sub_div = this._ol.children[i];
            let text_span = sub_div.children[0] as HTMLSpanElement;
            let value_span = sub_div.children[1] as HTMLSpanElement;
            text_span.innerText = step.text;
            value_span.innerText = '' + step.value;
        }
    }

    private ensure_sub_divs_length(n: number) {
        let child_nodes = this._ol.childNodes;
        let actual_children_count = child_nodes.length;

        //remove extra
        for (let ind = actual_children_count - 1; ind >= n; ind--)
            this._ol.removeChild(child_nodes[ind]);

        //add if not enough
        for (let ind = actual_children_count; ind < n; ind++) {
            let sub_div = document.createElement('li');
            sub_div.className = 'task-history-item'
            HistoryView.fill_sub_div(sub_div);
            this._ol.appendChild(sub_div);
        }
    }

    private static fill_sub_div(sub_div: HTMLLIElement) {
        let textSpan = document.createElement('span');
        let valueSpan = document.createElement('span');
        let editorDiv = document.createElement('div');
        textSpan.className = 'task-history-text';
        valueSpan.className = 'task-history-value';

        sub_div.append(textSpan, valueSpan, editorDiv);
    }
}
