import {History} from "../Step";

export class HistoryView {

    private _div: HTMLDivElement = document.createElement('div');
    private _history: History;

    constructor(history: History) {
        this._div.style.overflow = 'scroll';
        this._history = history;
    }

    private update(): void {
        let steps = this._history.steps;
        this.ensure_sub_divs_length(steps.length);

        for (let i = 0; i < steps.length; i++) {
            let step = steps[i];
            let sub_div = this._div.children[i];
            let text_span = sub_div.children[0] as HTMLSpanElement;
            let value_span = sub_div.children[1] as HTMLSpanElement;
            text_span.innerText = step.text;
            value_span.innerText = '' + step.value;
        }
    }

    private ensure_sub_divs_length(n: number) {
        let child_nodes = this._div.childNodes;
        let actual_children_count = child_nodes.length;

        //remove extra
        for (let ind = actual_children_count - 1; ind >= n; ind--)
            this._div.removeChild(child_nodes[ind]);

        //add if not enough
        for (let ind = actual_children_count; ind < n; ind++) {
            let sub_div = document.createElement('div');
            HistoryView.fill_sub_div(sub_div);
            this._div.appendChild(sub_div);
        }
    }

    private static fill_sub_div(sub_div: HTMLDivElement) {
        let textSpan = document.createElement('span');
        let valueSpan = document.createElement('span');
        let editorDiv = document.createElement('div');

        sub_div.append(textSpan, valueSpan, editorDiv);
    }
}
