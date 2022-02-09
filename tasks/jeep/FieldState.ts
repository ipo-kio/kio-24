import {Field} from "./Field";

export class FieldState {
    private readonly field: Field;
    private readonly values: number[];
    private readonly car_position: number = 0;
    private readonly car_fuel: number;

    static create(field: Field) {
        let n = field.size;
        let values = new Array(n).fill(0);
        values[0] = +Infinity;
        let car_position = 0;
        let car_fuel = 0;
        return new FieldState(field, values, car_position, car_fuel);
    }

    constructor(field: Field, values: number[], car_position: number, car_fuel: number) {
        this.field = field;
        this.values = values;
        this.car_position = car_position;
        this.car_fuel = car_fuel;
    }

    available_to_pick(): number {
        return this.values[this.car_position];
    }

    possible_to_pick(): number {
        return Math.min(this.available_to_pick(), this.field.settings.CAR_MAX_FUEL - this.car_fuel);
    }

    pick(amount: number): FieldState {
        if (amount > this.possible_to_pick())
            throw new Error(`Trying to pick ${amount} of fuel, but the car already has ${this.car_fuel} and only ${this.available_to_pick()} is available`);

        let new_values = this.values.slice();
        new_values[this.car_position] -= amount;

        return new FieldState(this.field, new_values, this.car_position, this.car_fuel + amount);
    }

    put(amount: number): FieldState {
        if (amount > this.car_fuel)
            throw new Error("Trying to put ${amount} of fuel, but the car has only ${this.car_fuel}");

        let new_values = this.values.slice();
        new_values[this.car_position] += amount;

        return new FieldState(this.field, new_values, this.car_position, this.car_fuel - amount);
    }

    move(new_position: number): FieldState {
        let need_fuel = this.field.distance(this.car_position, new_position);
        if (need_fuel > this.car_fuel)
            throw new Error("Trying to put ${amount} of fuel, but the car has only ${this.car_fuel}");

        return new FieldState(this.field, this.values, new_position, this.car_fuel - need_fuel);
    }
}
