import InputModel from "./InputModel";
import w1 from "./functions/w1(t)";

const stepSize = 0.03;

export default class PhysicsCore{
    private inputModel: InputModel;

    private selectedNi: number
    private selectedNiIndex: number
    private t: number
    private u: number
    private distance: number
    private subscriber?: (W: number, V: number, F: number,distance: number ,t: number) => void
    private exerciseSubscriber?: (W: number, V: number, F: number, power: number, distance: number, t: number) => void
    private speedChangeSubscriber?: (curSpeed: number) => void
    private onSimEnd?: () => void

    private intervalId: ReturnType<typeof setInterval> | undefined;


    constructor(gears: number[]) {
        this.inputModel = {
            kd: 1.2,
            l: 1.5,
            ni: gears, // gears
            w: t => 1.2
        };
        this.distance = 0;
        this.t = 0;
        this.u = this.calculateU()
        this.selectedNi = this.inputModel.ni[0];
        this.selectedNiIndex = 0;
    }

    private makeArr(startValue: number, stopValue: number, cardinality: number) {
        var arr = [];
        var step = (stopValue - startValue) / (cardinality - 1);
        for (let i = 0; i < cardinality; i++) {
            arr.push(startValue + (step * i));
        }
        return arr;
    }

    private calculateU(): number {
        return 2*Math.PI * this.inputModel.l * this.inputModel.w(this.t)
    }

    private update(): void {
        this.u = this.calculateU()
    }

    private step(): void {
        this.t += stepSize;
        this.update();
    }

    public run(): void {

        let tLimit = 1.5;
        let niMapping = this.makeArr(0, tLimit, this.inputModel.ni.length);
        niMapping = niMapping.reverse();


        this.intervalId = setInterval(() => {

            if (this.speedChangeSubscriber){
                this.speedChangeSubscriber(this.selectedNiIndex)
            }

            if (this.t > niMapping[niMapping.length-1]){
                niMapping.pop();
                this.selectedNiIndex++;
                if (this.speedChangeSubscriber){
                    this.speedChangeSubscriber(this.selectedNiIndex)
                }
                this.selectedNi = this.inputModel.ni[this.selectedNiIndex];
            }

            if (this.t > tLimit){
                    if (this.onSimEnd){
                        this.onSimEnd()
                    }
                  this.stop();
                  return;
            }

            this.step();

            if (this.subscriber){
                this.subscriber(this.getW(), this.getV(), this.getF(), this.distance, this.getT())
                this.distance += this.getV() * stepSize;
            }
            if (this.exerciseSubscriber){
                this.exerciseSubscriber(this.getW(), this.getVex(), this.getFex(), this.getPowerEx(), this.distance, this.getT())
                this.distance += this.getVex() * stepSize;
            }

        }, 200)
    }

    public subscribe(subscriber: (W: number, V: number, F: number, dist: number, t: number) => void): void {
        if (this.exerciseSubscriber){
            throw new Error("only one type of subscribers can be present")
        }
        this.subscriber = subscriber;
    }

    public subscribeAsEx(exerciseSubscriber: (W: number, V: number, F: number, power: number, dist: number, t: number) => void){
        if (this.subscriber){
            throw new Error("only one type of subscribers can be present")
        }
        this.exerciseSubscriber = exerciseSubscriber
    }

    public subscribeToSpeedChange(sub: (newSpeed: number) => void){
        this.speedChangeSubscriber = sub
    }

    public subscribeToSimEnd(sub: () => void){
        this.onSimEnd = sub
    }

    public stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.t = 0;
        this.update();
    }

    //----------------- getters and setters -----------------//

    public setNi(ni: number[]): void {
        this.inputModel.ni = ni;
        this.selectedNi = this.inputModel.ni[0];
        this.selectedNiIndex = 0;
    }

    public getNi(): number[] {
        return this.inputModel.ni;
    }

    public getW(): number {
        return this.inputModel.w(this.t);
    }

    public getV(): number {
        return this.u * this.selectedNi;
    }

    public getVex(): number{
        return this.u * Math.sqrt((2*this.selectedNi) / this.inputModel.kd)
    }

    public getF(): number {
        return this.inputModel.kd * this.selectedNi * this.selectedNi * this.u;
    }

    public getFex(): number{
        return this.selectedNi * this.u
    }

    public getPowerEx(): number{
        return 2 * this.selectedNi * this.u * this.u
    }

    public getT(): number {
        return this.t;
    }


}