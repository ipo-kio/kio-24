import {Component} from "react";
import "./SceneStyle.css";
import ExerciseBikeComponent from "../animation/ExerciseBikeComponent";
import GearTable from "../geartable/GearTable";
import GraphicsComponent from "../graphics/GraphicsComponent";
import PhysicsCore from "../../physics/PhysicsCore";
import {Level} from "../../Level";
import ExBikeSpeedComponent from "../speedometer/ExBikeSpeedComponent";
import BikeSpeedComponent from "../speedometer/BikeSpeedComponent";
import {KioApi} from "../../../KioApi";
import {Solution} from "../../solution";

type Props = {
    level: Level,
    kioApi: KioApi
}

type State = {
    Tlist: number[]
    wList: number[]

    bicycleFlist: number[]
    bicycleSpeed: number
    bicycleSpeedList: number[]
    bicycleDistance: number[]

    exerciseFlist: number[]
    exerciseSpeed: number
    exerciseSpeedList: number[]
    exercisePower: number
    exerciseDistance: number[]
    curMode: number

    curGear: number
    curX: number
    curY: number
    lockTableSpeed: boolean

    tableData: number[][]
}

export default class SceneComponent extends Component {

    state: State;
    props: Props;

    BVList: number[] = []
    EVList: number[] = []

    bicyclePhysics: PhysicsCore | undefined;
    exerciseBikePhysics: PhysicsCore | undefined;
    choosenExGears: number[]

    graphicsBackground: string;
    yellowColor: string;
    cyanColor: string;
    greenColor: string;

    constructor(props: Props) {
        super(props);
        this.props = props;
        this.choosenExGears = []

        this.state = { // TODO: reset state on sim restart
            Tlist: [],
            wList: [],
            bicycleFlist: [],
            bicycleSpeed: 0,
            bicycleSpeedList: [],
            exerciseFlist: [],
            exerciseDistance: [],
            bicycleDistance: [],
            exerciseSpeed: 0,
            exerciseSpeedList: [],
            exercisePower: 0,
            curMode: 0,
            curGear: 0,
            curX: 0,
            curY: 0,
            lockTableSpeed: false,
            tableData: [[]]
        }

        this.graphicsBackground = "#666666";
        this.yellowColor = "#F7F743";
        this.cyanColor = "#66FFCC";
        this.greenColor = "#8EED00";

    }

    // ----------------KIO METHODS---------------------

    getTableData = () => {
        return { tableData: this.state.tableData}
    }

    loadSolution = (data : {tableData: number[][]}) => {
        this.setState({
            tableData: data.tableData
        })
    }

    // ------------------------------------------------

    componentDidMount = () => {
        this.loadLevel(this.props.level) //maybe just put in into constructor?
    }

    private loadLevel = (selectedLvl: Level) => {
        switch (selectedLvl) {
            case Level.high_9_11:
                this.setState({
                    tableData: [
                        [1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1],
                    ]
                })
                break

            case Level.middle_6_8:
                this.setState({
                    tableData: [
                        [1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1]
                    ]
                })
                break

            case Level.low_1_5:
                this.setState({
                    tableData: [
                        [1, 1, 1, 1],
                        [1, 1, 1, 1],
                        [1, 1, 1, 1]
                    ]
                })
                break

            default:
                throw new Error("Unknown level")

        }
    }

    startSimulation = () => {
        let gears = [3.4, 3.14, 2.75, 2.83, 2.8, 2.42, 2.125, 1.88, 1.61, 1.57, 1.41, 1.21, 1.06, 1.0, 0.94, 0.80, 0.75, 0.68].reverse()
        let exgears = [0.4, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6] // TODO validate table based on number of modes here

        this.setState({
                curMode: 0,
                curGear: 0,
                curX: 0,
                curY: 0,
                lockTableSpeed: true
            }
        )

        let speedIndexes = this.state.tableData.flat()

        for (let i = 0; i < speedIndexes.length; i++) {
            speedIndexes[i] -= 1
        }

        this.choosenExGears = []

        for (let i = 0; i < gears.length; i++) {
            this.choosenExGears.push(exgears[speedIndexes[i]])
        }

        if (this.bicyclePhysics) {
            this.bicyclePhysics.stop()
        }
        if (this.exerciseBikePhysics) {
            this.exerciseBikePhysics.stop()
        }

        this.bicyclePhysics = new PhysicsCore(gears);
        this.exerciseBikePhysics = new PhysicsCore(this.choosenExGears);

        this.setState({
            Tlist: [],
            wList: [],
            bicycleFlist: [],
            exerciseFlist: []
        })

        this.bicyclePhysics?.subscribeToSimEnd(() => {
            this.setState({lockTableSpeed: false})
            const BFList = this.state.bicycleFlist
            const EFList = this.state.exerciseFlist // TODO: speed up physics



            let diff = 0
            let speedDiff = 0

            for (const i in BFList) {
                diff += BFList[i] - EFList[i]
            }

            for (const i in this.BVList) {
                speedDiff += this.BVList[i] - this.EVList[i]
            }

            diff = diff / BFList.length
            speedDiff = speedDiff / this.BVList.length

            diff = Math.round(diff * 100) / 100;
            speedDiff = Math.round(speedDiff * 100) / 100;

            let res: Solution = {diffF: diff, avgSpeedDiff: speedDiff}
            console.log("ended with ", res)
            console.log("submitted")
            this.props.kioApi.submitResult(res)
            this.EVList = []
            this.BVList = []
        })
        this.startBicycleSimulation();
        this.startExerciseSimulation();
    }

    startBicycleSimulation = () => {

        const subscriber = (W: number, V: number, F: number, distance: number ,t: number) => {

            //round t and W to 2 digits after comma
            t = Math.round(t * 100) / 100;
            W = Math.round(W * 100) / 100;
            F = Math.round(F * 100) / 100;
            V = Math.round(V * 100) / 100;
            distance = Math.round(distance * 100) / 100;

            this.BVList.push(V)

            this.setState({
                Tlist: [...this.state.Tlist, t],
                wList: [...this.state.wList, W],
                bicycleFlist: [...this.state.bicycleFlist, F],
                bicycleDistance: [...this.state.bicycleDistance, distance],
                bicycleSpeed: V,
                bicycleSpeedList: [...this.state.bicycleSpeedList, V]
            })
        }

        const speedSubscriber = (gear: number) => {

            let maxX = this.state.tableData[0].length
            let maxY = this.state.tableData.length

            let x = gear % maxX
            let y = Math.floor(gear / maxX)

            if (y > 2){ //TODO: check why overflow
                return
            }

            this.setState({
                curGear: gear,
                curX: x,
                curY: y,
                curMode: this.state.tableData[y][x]
            })
        }

        if (this.bicyclePhysics) {
            this.bicyclePhysics.subscribe(subscriber)
            this.bicyclePhysics.subscribeToSpeedChange(speedSubscriber)
            this.bicyclePhysics.run()
        }

    }

    startExerciseSimulation = () => {
        // const subscriber = (W: number, V: number, F: number, t: number) => {
        //
        //     t = Math.round(t * 100) / 100;
        //     W = Math.round(W * 100) / 100;
        //     F = Math.round(F * 100) / 100;
        //
        //     this.setState({
        //         exerciseFlist: [...this.state.exerciseFlist, F],
        //         exerciseSpeed: V
        //     })
        // }

        const subscriber = (W: number, V: number, F: number, power: number, dist: number, t: number) => {
                F = Math.round(F * 100) / 100;
                power = Math.round(power);
                V = Math.round(V * 100) / 100;
                dist = Math.round(dist * 100) / 100;

                this.EVList.push(V)

                this.setState({
                    exerciseFlist: [...this.state.exerciseFlist, F],
                    exerciseSpeed: V,
                    exerciseSpeedList: [...this.state.exerciseSpeedList, V],
                    exercisePower: power,
                    exerciseDistance: [...this.state.exerciseDistance, dist]
                })
        }

        if (this.exerciseBikePhysics) {
            this.exerciseBikePhysics.subscribeAsEx(subscriber);
            this.exerciseBikePhysics.run();
        }

    }

    tableChange = (arr: number[][]) => {
        this.setState({
            tableData: arr
        })

        // this.updateExerciseBikeGears(arr)
    }




    render() {

        const speedDiff: number[] = []

        const maxSize = Math.max(this.state.exerciseSpeedList.length, this.state.bicycleSpeedList.length);

        for (let i = 0; i < maxSize; i++) {
            speedDiff.push(Math.abs(this.state.exerciseSpeedList[i] - this.state.bicycleSpeedList[i]))
        }

        let sum = 0
        this.state.tableData.forEach((row) => {
            row.forEach((value) => {
                sum += value
            })
        })

        sum += this.state.curGear + 1 + (this.state.lockTableSpeed ? 1 : 0)

        return (
            (this.props.level === (Level.low_1_5 || Level.middle_6_8)) ? // Это всё для маленьких
                <div className="page-container">
                    <div className="bicycle-left-2">
                        <div className="left-speedometer-2">
                            <BikeSpeedComponent color={this.cyanColor} left={this.state.curY + 1 + ""} right={this.state.curX + 1 +""} speed={this.state.bicycleSpeed}
                                                distance={this.state.bicycleDistance[this.state.bicycleDistance.length - 1]} isBlur={false}/>
                        </div>
                        <div className="bike-handlebar-2"/>
                        <div className="b-container-2"/>
                        <div className="left-speedometer-handlebar-2">
                            <BikeSpeedComponent color={this.cyanColor} left={"05"} right={"02"} speed={175.87}
                                                distance={198} isBlur={true}/>
                        </div>
                    </div>

                    <div className="center-2">
                        <div className="center-box" style={{height: "85%", flexDirection: "column"}}>
                            <GearTable key={sum} tableData={this.state.tableData}
                                       onChange={this.tableChange}
                                       lockSpeed={this.state.lockTableSpeed}
                                       selectedSpeedX={this.state.curY}
                                       selectedSpeedY={this.state.curX}
                                       kioApi={this.props.kioApi}
                            />
                            <button className="check-button-2" onClick={this.startSimulation}>ПРОВЕРИТЬ РЕЗУЛЬТАТ
                            </button>
                        </div>
                    </div>

                    <div className="exercise-right-2">
                        <div className="right-speedometer-2">
                            <ExBikeSpeedComponent color={this.yellowColor} time={(this.state.Tlist[this.state.Tlist.length-1])?.toString() || "0.00"} power={this.state.exercisePower}
                                                  speed={this.state.exerciseSpeed} distance={this.state.exerciseDistance[this.state.exerciseDistance.length - 1]} mode={this.state.curMode.toString() || "1"} isBlur={false}/>
                        </div>
                        <div className="ex-bike-handlebar-2"/>
                        <div className="e-container-2"/>
                        <div className="right-speedometer-handlebar-2">
                            <ExBikeSpeedComponent color={this.yellowColor} time={"00:05"} power={0.3} speed={175.87}
                                                  distance={198} isBlur={true}/>
                        </div>
                    </div>

                </div>

                :

                <>
                    <div className="page-container">
                        <div className="bicycle-left">
                            {/*<div className="bike-handlebar"/>*/}
                            {/*<div className="b-container"/>*/}
                            <div className={"bicycle-image"}/>
                            <div className="v-box">
                                <div className="f-graphic" style={{background: this.graphicsBackground}}>
                                    <GraphicsComponent x={this.state.Tlist} x_label_name={""}
                                                       y={this.state.bicycleDistance}
                                                       y_label_name={""} result_label_name={""}
                                                       max_y={this.state.bicycleDistance[this.state.bicycleDistance.length - 1] > 10 ?
                                                           this.state.bicycleDistance[this.state.bicycleDistance.length - 1] + 5 : 10}
                                                       max_x={1.6} color={this.cyanColor}/>
                                    <div className="f-t-label" style={{color: this.cyanColor}}>
                                        <label style={{fontSize: "1.5em"}}>t</label>
                                        <label style={{fontSize: "1em"}}>ч.</label>
                                    </div>
                                    <div className="f-f-label" style={{color: this.cyanColor}}>
                                        <label style={{fontSize: "1.5em"}}>S</label>
                                        <label style={{fontSize: "1em"}}>Дистанция, км</label>
                                    </div>
                                </div>
                            </div>
                            {/*<div className="left-speedometer-handlebar">*/}
                            {/*    <BikeSpeedComponent color={this.cyanColor} left={this.state.curY + ""} right={this.state.curX + ""} speed={175.87}*/}
                            {/*                        distance={198} isBlur={true}/> /!* fake *!/*/}
                            {/*</div>*/}
                        </div>

                        <div className="center">
                            <div className="center-box" style={{height: "30%"}}>
                                <div className="left-speedometer">
                                    <BikeSpeedComponent color={this.cyanColor} left={this.state.curY + 1 + ""} right={this.state.curX + 1 +""} speed={this.state.bicycleSpeed}
                                                        distance={this.state.bicycleDistance[this.state.bicycleDistance.length - 1]} isBlur={false}/>
                                </div>
                                <div className="right-speedometer">
                                    <ExBikeSpeedComponent color={this.yellowColor} time={(this.state.Tlist[this.state.Tlist.length-1])?.toString() || "0.00"} power={this.state.exercisePower}
                                                          speed={this.state.exerciseSpeed} distance={this.state.exerciseDistance[this.state.exerciseDistance.length - 1]} mode={this.state.curMode.toString() || "1"} isBlur={false}/>
                                </div>
                            </div>

                            <div className="center-box" style={{height: "40%", flexDirection: "column"}}>
                                <GearTable key={sum} tableData={this.state.tableData}
                                           onChange={this.tableChange}
                                           lockSpeed={this.state.lockTableSpeed}
                                           selectedSpeedX={this.state.curY}
                                           selectedSpeedY={this.state.curX}
                                           kioApi={this.props.kioApi}
                                />
                                <button className="check-button" onClick={this.startSimulation}>ПРОВЕРИТЬ РЕЗУЛЬТАТ
                                </button>
                            </div>

                            <div className="v-box">
                                <div className="f-graphic" style={{background: this.graphicsBackground}}>
                                    <GraphicsComponent x={this.state.Tlist} x_label_name={""} y={speedDiff}
                                                       y_label_name={""} result_label_name={""}
                                                       max_y={(speedDiff[speedDiff.length-1] > 20) ? speedDiff[speedDiff.length-1] + 10 : 20}
                                                       max_x={1.6} color={this.greenColor}/>
                                    <div className="f-t-label" style={{color: this.greenColor}}>
                                        <label style={{fontSize: "1.5em"}}>t</label>
                                        <label style={{fontSize: "1em"}}>сек</label>
                                    </div>
                                    <div className="f-f-label" style={{color: this.greenColor}}>
                                        <label style={{fontSize: "1.5em"}}>V, км/ч</label>
                                        <label style={{fontSize: "1em"}}>Абсолютная разность скоростей</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="exercise-right">
                            <div className="ex-bike-handlebar">

                            </div>
                            <div className="e-container"/>
                            <div className="v-box">
                                <div className="f-graphic" style={{background: this.graphicsBackground}}>
                                    <GraphicsComponent x={this.state.Tlist} x_label_name={""}
                                                       y={this.state.exerciseDistance}
                                                       y_label_name={""} result_label_name={""}
                                                       max_y={this.state.bicycleDistance[this.state.bicycleDistance.length - 1] > 10 ?
                                                           this.state.bicycleDistance[this.state.bicycleDistance.length - 1] + 5 : 10}
                                                       max_x={1.5} color={this.yellowColor}/>
                                    <div className="f-t-label" style={{color: this.yellowColor}}>
                                        <label style={{fontSize: "1.5em"}}>t</label>
                                        <label style={{fontSize: "1em"}}>ч.</label>
                                    </div>
                                    <div className="f-f-label" style={{color: this.yellowColor}}>
                                        <label style={{fontSize: "1.5em"}}>S</label>
                                        <label style={{fontSize: "1em"}}>Дистанция, км</label>
                                    </div>
                                </div>
                            </div>
                            <div className="right-speedometer-handlebar">
                                <ExBikeSpeedComponent color={this.yellowColor} time={(this.state.Tlist[this.state.Tlist.length-1])?.toString() || "0.00"} power={this.state.exercisePower}
                                                      speed={this.state.exerciseSpeed} distance={this.state.exerciseDistance[this.state.exerciseDistance.length - 1]} mode={this.state.curMode.toString() || "1"} isBlur={true}/>
                            </div>
                        </div>

                    </div>
                </>
        );
    }

}