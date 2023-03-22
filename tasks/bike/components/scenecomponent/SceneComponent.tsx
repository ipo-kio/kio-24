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

        this.tableSelectedItem = this.tableSelectedItem.bind(this);

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
        let gears = [3.4, 3.14, 2.83, 2.8, 2.75, 2.42, 2.125, 1.88, 1.61, 1.57, 1.41, 1.21, 1.06, 1.0, 0.94, 0.80, 0.75, 0.68]
        let exgears = [0.2, 0.6, 1, 1.4, 2, 2.4, 2.8, 3.2, 3.6, 4, 4.4, 4.8, 5.2, 5.6, 6, 6.8]
        // let exgears = [0.2, 0.4, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4]

        this.setState({
                curMode: 0,
                curGear: 0,
                curX: 0,
                curY: 0,
                lockTableSpeed: true
            }
        )

        // let speedIndexes = this.state.tableData.flat()
        //
        // for (let i = 0; i < speedIndexes.length; i++) {
        //     speedIndexes[i] -= 1
        // }

        this.choosenExGears = this.state.tableData.flat().map(elem => elem * 22);
        console.log(this.choosenExGears)
        console.log(this.BVList)
        console.log(this.EVList)


        // for (let i = 0; i < gears.length; i++) {
        //     this.choosenExGears.push(exgears[speedIndexes[i]])
        // }

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
                diff += Math.abs(BFList[i] - EFList[i])
            }

            let diffArray = [];

            for (const i in this.BVList) {
                diffArray.push(this.BVList[i] - this.EVList[i])
                speedDiff += this.BVList[i] - this.EVList[i]
            }

            diff = diff / BFList.length
            diff = Math.round(diff * 100) / 100;

            let res: Solution = {diffF: diff, maxSpeedDeviation: Math.round(Math.max(...diffArray) * 100) / 100}
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
                console.log("problem")
                return
            }

            this.setState({
                curGear: gear,
                curX: y,
                curY: x,
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

    tableSelectedItem = (row: number, col: number) => {
        this.setState({
            curX: row,
            curY: col
        });
    }

    // updateExerciseBikeGears = (arr: number[][]) => {
    //     if (this.bicyclePhysics) {
    //         let gears: number[] = []
    //         arr.forEach((row) => {
    //             row.forEach((value) => {
    //                 // @ts-ignore
    //                 gears.push(this.bicyclePhysics.getNi()[value - 1])
    //             })
    //         })
    //
    //         // @ts-ignore
    //         this.exerciseBikePhysics.setNi(gears)
    //
    //     }
    //
    // };

    render() {

        const speedDiff: number[] = []

        const maxSize = Math.max(this.BVList.length, this.EVList.length);

        for (let i = 0; i < maxSize; i++) {
            speedDiff.push(Math.abs(this.BVList[i] - this.EVList[i]))
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
                            <BikeSpeedComponent color={this.cyanColor} left={this.state.curX + 1 + ""} right={this.state.curY + 1 +""} speed={this.state.bicycleSpeed}
                                                distance={this.state.bicycleDistance[this.state.bicycleDistance.length - 1]} isBlur={false} />
                        </div>
                        <div className="bike-module-2"/>
                    </div>

                    <div className="center-2">
                        <div className="center-box" style={{height: "85%", flexDirection: "column"}}>
                            <GearTable key={sum}
                                       tableData={this.state.tableData}
                                       onChange={this.tableChange}
                                       lockSpeed={this.state.lockTableSpeed}
                                       selectedSpeedX={this.state.curX}
                                       selectedSpeedY={this.state.curY}
                                       kioApi={this.props.kioApi}
                                       onSelectedItem={this.tableSelectedItem}
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
                        <div className="e-bike-module-2"/>
                    </div>

                </div>

                :

                <>
                    <div className="page-container">
                        <div className="bicycle-left">
                            <div className="bike-module"/>
                            <div className="v-box">
                                <div className="f-graphic" style={{background: this.graphicsBackground}}>
                                    <GraphicsComponent x={this.state.Tlist} x_label_name={""}
                                                       y={this.state.bicycleDistance}
                                                       y_label_name={""} result_label_name={""}
                                                       max_y={40}
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
                        </div>

                        <div className="center">
                            <div className="center-box" style={{height: "30%"}}>
                                <div className="left-speedometer">
                                    <BikeSpeedComponent color={this.cyanColor} left={ 2 - this.state.curX + 1 + ""} right={ 5 - this.state.curY + 1 +""} speed={this.state.bicycleSpeed}
                                                        distance={this.state.bicycleDistance[this.state.bicycleDistance.length - 1]} isBlur={false}/>
                                </div>
                                <div className="right-speedometer">
                                    <ExBikeSpeedComponent color={this.yellowColor} time={(this.state.Tlist[this.state.Tlist.length-1])?.toString() || "0.00"} power={this.state.exercisePower/22}
                                                          speed={this.state.exerciseSpeed} distance={this.state.exerciseDistance[this.state.exerciseDistance.length - 1]} mode={this.state.curMode.toString() || "1"} isBlur={false}/>
                                </div>
                            </div>

                            <div className="center-box-table">
                                <GearTable key={sum} tableData={this.state.tableData}
                                           onChange={this.tableChange}
                                           lockSpeed={this.state.lockTableSpeed}
                                           selectedSpeedX={this.state.curX}
                                           selectedSpeedY={this.state.curY}
                                           kioApi={this.props.kioApi}
                                           onSelectedItem={this.tableSelectedItem}
                                />
                                <button className="check-button" onClick={this.startSimulation}>ПРОВЕРИТЬ РЕЗУЛЬТАТ
                                </button>
                            </div>

                            <div className="v-box">
                                <div className="f-graphic" style={{background: this.graphicsBackground}}>
                                    <GraphicsComponent x={this.state.Tlist} x_label_name={""} y={speedDiff}
                                                       y_label_name={""} result_label_name={""}
                                                       max_y={40}
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
                            <div className="e-bike-module"/>
                            <div className="v-box">
                                <div className="f-graphic" style={{background: this.graphicsBackground}}>
                                    <GraphicsComponent x={this.state.Tlist} x_label_name={""}
                                                       y={this.state.exerciseDistance}
                                                       y_label_name={""} result_label_name={""}
                                                       max_y={40}
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
                        </div>

                    </div>
                </>
        );
    }

}
