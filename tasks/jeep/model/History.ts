import {Step} from "./Step";
import {FieldState} from "./FieldState";
import {Field} from "./Field";

export class History {
    private _steps: Step[];
    private _update_listeners: (() => void)[] = [];
    private _initial_state: FieldState;
    private list_of_states: FieldState[] = null;

    constructor(steps: Step[], initial_state: FieldState) {
        this._steps = steps;
        this._initial_state = initial_state;
    }

    get steps(): Step[] {
        return this._steps;
    }

    step(index: number): Step {
        return this._steps[index];
    }

    state(index: number): FieldState {
        this.ensure_states_evaluated();
        if (index < 0)
            return this._initial_state;
        if (this.list_of_states.length <= index)
            return this.list_of_states[this.list_of_states.length - 1];
        return this.list_of_states[index];
    }

    update(index: number, step: Step): void {
        this._steps[index] = step;
        this.fire_update();
        this.update_field_states(index);
    }

    insert(index: number, step: Step): void {
        this._steps.splice(index, 0, step);
        this.fire_update();
        this.update_field_states(index);
    }

    get size(): number {
        return this._steps.length;
    }

    add_listener(listener: () => void): void {
        this._update_listeners.push(listener);
    }

    fire_update(): void {
        for (const updateListener of this._update_listeners)
            updateListener();
    }

    //          steps :   0   1   2   3   4
    // list of states : 0   1   2   3   4   5

    update_field_states(index: number = 0 /* first changed index of 'steps' */) {
        this.ensure_states_evaluated();

        this.list_of_states.splice(index + 1);
        let last_state = this.list_of_states[index];
        if (!last_state)
            return;

        let n = this.size;
        for (let i = index; i < n; i++) {
            let next_step = this._steps[index];
            if (!next_step.change_possible(last_state))
                break;
            let next_state = next_step.change_state(last_state);
            this.list_of_states.push(next_state);
            last_state = next_state;
        }
        this.fire_update();
    }

    ensure_states_evaluated() {
        if (this.list_of_states == null) {
            this.list_of_states = [this._initial_state];
            this.update_field_states(0);
        }
    }


    get initial_state(): FieldState {
        return this._initial_state;
    }
}
