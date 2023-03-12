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
    Tlist: number[];
    wList: number[];

    bicycleFlist: number[];
    bicycleSpeed: number;
    bicycleDistance: number;

    exerciseFlist: number[];
    exerciseSpeed: number;
    exercisePower: number;
    exerciseDistance: number;
    curMode: number;

    curGear: number;
    curX: number;
    curY: number;
    lockTableSpeed: boolean;

    tableData: number[][];
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

        this.state = {
            Tlist: [],
            wList: [],
            bicycleFlist: [],
            bicycleSpeed: 0,
            exerciseFlist: [],
            exerciseDistance: 0,
            bicycleDistance: 0,
            exerciseSpeed: 0,
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
        this.loadLevel(this.props.level) // TODO: maybe just put in into constructor?
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
                bicycleDistance: distance,
                bicycleSpeed: V
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
                    exercisePower: power,
                    exerciseDistance: dist
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
                                                distance={this.state.bicycleDistance} isBlur={false}/>
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
                                                  speed={this.state.exerciseSpeed} distance={this.state.exerciseDistance} mode={this.state.curMode.toString() || "1"} isBlur={false}/>
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
                            <div className="bike-handlebar"/>
                            <div className="b-container"/>
                            <div className="v-box">
                                <div className="f-graphic" style={{background: this.graphicsBackground}}>
                                    <GraphicsComponent x={this.state.Tlist} x_label_name={""}
                                                       y={this.state.bicycleFlist}
                                                       y_label_name={""} result_label_name={""}
                                                       max_y={this.state.bicycleFlist[this.state.bicycleFlist.length - 1] > 10 ?
                                                           this.state.bicycleFlist[this.state.bicycleFlist.length - 1] + 5 : 10}
                                                       max_x={1.5} color={this.cyanColor}/>
                                    <div className="f-t-label" style={{color: this.cyanColor}}>
                                        <label style={{fontSize: "1.5em"}}>t</label>
                                        <label style={{fontSize: "1em"}}>ч.</label>
                                    </div>
                                    <div className="f-f-label" style={{color: this.cyanColor}}>
                                        <label style={{fontSize: "1.5em"}}>F</label>
                                        <label style={{fontSize: "1em"}}>сила</label>
                                    </div>
                                </div>
                            </div>
                            <div className="left-speedometer-handlebar">
                                <BikeSpeedComponent color={this.cyanColor} left={this.state.curY + ""} right={this.state.curX + ""} speed={175.87}
                                                    distance={198} isBlur={true}/> {/* fake */}
                            </div>
                        </div>

                        <div className="center">
                            <div className="center-box" style={{height: "30%"}}>
                                <div className="left-speedometer">
                                    <BikeSpeedComponent color={this.cyanColor} left={this.state.curY + 1 + ""} right={this.state.curX + 1 +""} speed={this.state.bicycleSpeed}
                                                        distance={this.state.bicycleDistance} isBlur={false}/>
                                </div>
                                <div className="right-speedometer">
                                    <ExBikeSpeedComponent color={this.yellowColor} time={(this.state.Tlist[this.state.Tlist.length-1])?.toString() || "0.00"} power={this.state.exercisePower}
                                                          speed={this.state.exerciseSpeed} distance={this.state.exerciseDistance} mode={this.state.curMode.toString() || "1"} isBlur={false}/>
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
                                    <GraphicsComponent x={this.state.Tlist} x_label_name={""} y={this.state.wList}
                                                       y_label_name={""} result_label_name={""}
                                                       max_y={2}
                                                       max_x={1.5} color={this.greenColor}/>
                                    <div className="f-t-label" style={{color: this.greenColor}}>
                                        <label style={{fontSize: "1.5em"}}>t</label>
                                        <label style={{fontSize: "1em"}}>сек</label>
                                    </div>
                                    <div className="f-f-label" style={{color: this.greenColor}}>
                                        <label style={{fontSize: "1.5em"}}>W</label>
                                        <label style={{fontSize: "1em"}}>обороты/сек</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="exercise-right">
                            <div className="ex-bike-handlebar">
                                <svg width="283" height="310" viewBox="0 0 283 310" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M124.183 166.206C124.183 156.85 131.787 149.245 141.143 149.245C150.5 149.245 158.104 156.85 158.104 166.206V292.337C158.104 301.722 150.5 309.298 141.143 309.298C131.787 309.298 124.183 301.722 124.183 292.337V166.206Z" fill="#1A1A1A"/>
                                    <path d="M145.638 268.055C139.419 268.055 134.387 263.023 134.387 256.804C134.387 250.585 139.419 245.554 145.638 245.554L233.409 245.78C239.996 245.78 247.854 245.78 252.914 243.207C256.758 241.257 259.557 236.791 259.5 227.123L259.076 130.73C259.076 127.988 259.218 125.19 259.359 121.995C259.896 110.293 260.688 92.7665 255.119 78.2369L231.091 15.4542C228.858 9.60277 231.798 3.10119 237.621 0.868035C243.444 -1.33685 249.974 1.57473 252.207 7.39789L276.235 70.1806C283.415 88.9786 282.482 109.36 281.888 122.956C281.747 126.122 281.606 128.864 281.606 130.645L282.03 227.038C282.143 247.278 274.058 257.794 263.09 263.362C253.338 268.309 242.455 268.309 233.409 268.309L145.638 268.055Z" fill="#333333"/>
                                    <path d="M153.185 261.016C150.867 261.016 148.973 259.122 148.973 256.804C148.973 254.458 150.867 252.592 153.185 252.592L233.409 252.819C240.759 252.847 249.578 252.819 256.108 249.511C262.157 246.43 266.624 240.07 266.567 227.095L266.143 130.702C266.115 128.271 266.256 125.472 266.398 122.306C266.963 109.982 267.783 91.5793 261.705 75.7211L237.678 12.9384C236.858 10.7335 237.96 8.30247 240.137 7.45444C242.314 6.63468 244.773 7.73712 245.593 9.91374L269.62 72.6964C276.32 90.1659 275.443 109.642 274.85 122.674C274.68 125.84 274.567 128.61 274.567 130.674L274.991 227.067C275.076 243.999 268.659 252.621 259.896 257.059C251.642 261.271 241.692 261.271 233.409 261.271L153.185 261.016Z" fill="#4D4D4D"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M237.706 0.811502C243.586 -1.36512 249.889 1.00938 251.699 5.87143C253.479 10.7618 250.2 16.4718 244.321 18.6485C238.469 20.8251 232.25 18.6202 230.441 13.7299C228.632 8.86781 231.855 2.98812 237.706 0.811502Z" fill="#666666"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M266.511 103.141H275.387C277.139 103.141 278.581 104.582 278.581 106.363V121.232C278.581 122.985 277.139 124.426 275.387 124.426H266.511C264.758 124.426 263.317 122.985 263.317 121.232V106.363C263.317 104.582 264.758 103.141 266.511 103.141Z" fill="#B5B510"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M267.613 105.204H274.171C275.472 105.204 276.517 106.278 276.517 107.579V120.017C276.517 121.317 275.472 122.391 274.171 122.391H267.613C266.313 122.391 265.239 121.317 265.239 120.017V107.579C265.239 106.278 266.313 105.204 267.613 105.204Z" fill="#F7F743"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M266.511 130.617H275.387C277.139 130.617 278.581 132.059 278.581 133.811V148.708C278.581 150.461 277.139 151.903 275.387 151.903H266.511C264.758 151.903 263.317 150.461 263.317 148.708V133.811C263.317 132.059 264.758 130.617 266.511 130.617Z" fill="#B5B510"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M267.613 132.681H274.171C275.472 132.681 276.517 133.755 276.517 135.055V147.493C276.517 148.793 275.472 149.867 274.171 149.867H267.613C266.313 149.867 265.239 148.793 265.239 147.493V135.055C265.239 133.755 266.313 132.681 267.613 132.681Z" fill="#F7F743"/>
                                    <path d="M136.649 245.554C142.868 245.554 147.899 250.585 147.899 256.804C147.899 263.023 142.868 268.055 136.649 268.055L48.8773 268.309C39.8316 268.309 28.9485 268.309 19.1961 263.362C8.22826 257.794 0.143682 247.278 0.256753 227.038L0.680769 130.645C0.680769 128.864 0.539431 126.122 0.398092 122.956C-0.195531 109.36 -1.12837 88.9787 6.05164 70.1806L30.0792 7.39791C32.3124 1.57475 38.8422 -1.33683 44.6654 0.868055C50.4886 3.10121 53.4284 9.60279 51.1952 15.4542L27.1677 78.2369C21.5989 92.7665 22.3904 110.293 22.9275 121.995C23.0688 125.19 23.2102 127.988 23.2102 130.73L22.7862 227.123C22.7296 236.791 25.5281 241.257 29.3725 243.208C34.4325 245.78 42.2909 245.78 48.8773 245.78L136.649 245.554Z" fill="#333333"/>
                                    <path d="M129.101 252.592C131.419 252.592 133.313 254.458 133.313 256.804C133.313 259.122 131.419 261.016 129.101 261.016L48.8773 261.271C40.5948 261.271 30.6446 261.271 22.3904 257.059C13.6274 252.621 7.21061 243.999 7.29541 227.067L7.71943 130.674C7.71943 128.61 7.60636 125.84 7.43675 122.674C6.84313 109.642 5.96683 90.1659 12.6663 72.6964L36.6939 9.91376C37.5136 7.73714 39.9729 6.6347 42.1496 7.45446C44.3262 8.30249 45.4286 10.7335 44.6088 12.9384L20.5813 75.7211C14.5037 91.5793 15.3235 109.982 15.8888 122.306C16.0301 125.472 16.1715 128.271 16.1432 130.702L15.7192 227.095C15.6627 240.07 20.129 246.43 26.1783 249.511C32.7081 252.819 41.5277 252.847 48.8773 252.819L129.101 252.592Z" fill="#4D4D4D"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M44.5806 0.811521C38.7009 -1.3651 32.3972 1.00939 30.5881 5.87145C28.8072 10.7618 32.0863 16.4719 37.966 18.6485C43.8174 20.8251 50.0363 18.6202 51.8454 13.7299C53.6546 8.86783 50.432 2.98814 44.5806 0.811521Z" fill="#666666"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7758 103.141H6.8997C5.1471 103.141 3.70544 104.583 3.70544 106.363V121.232C3.70544 122.985 5.1471 124.426 6.8997 124.426H15.7758C17.5284 124.426 18.97 122.985 18.97 121.232V106.363C18.97 104.583 17.5284 103.141 15.7758 103.141Z" fill="#B5B510"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6733 105.204H8.11514C6.81483 105.204 5.76892 106.279 5.76892 107.579V120.017C5.76892 121.317 6.81483 122.391 8.11514 122.391H14.6733C15.9736 122.391 17.0478 121.317 17.0478 120.017V107.579C17.0478 106.279 15.9736 105.204 14.6733 105.204Z" fill="#F7F743"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7758 130.617H6.8997C5.1471 130.617 3.70544 132.059 3.70544 133.811V148.709C3.70544 150.461 5.1471 151.903 6.8997 151.903H15.7758C17.5284 151.903 18.97 150.461 18.97 148.709V133.811C18.97 132.059 17.5284 130.617 15.7758 130.617Z" fill="#B5B510"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6733 132.681H8.11514C6.81483 132.681 5.76892 133.755 5.76892 135.055V147.493C5.76892 148.793 6.81483 149.867 8.11514 149.867H14.6733C15.9736 149.867 17.0478 148.793 17.0478 147.493V135.055C17.0478 133.755 15.9736 132.681 14.6733 132.681Z" fill="#F7F743"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M141.143 231.985C155.56 231.985 167.234 243.66 167.234 258.048C167.234 272.465 155.56 284.139 141.143 284.139C126.727 284.139 115.052 272.465 115.052 258.048C115.052 243.66 126.727 231.985 141.143 231.985Z" fill="#333333"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M141.143 242.981C149.454 242.981 156.21 249.737 156.21 258.048C156.21 266.387 149.454 273.143 141.143 273.143C132.804 273.143 126.077 266.387 126.077 258.048C126.077 249.737 132.804 242.981 141.143 242.981Z" fill="#4D4D4D"/>
                                </svg>
                            </div>
                            <div className="e-container"/>
                            <div className="v-box">
                                <div className="f-graphic" style={{background: this.graphicsBackground}}>
                                    <GraphicsComponent x={this.state.Tlist} x_label_name={""}
                                                       y={this.state.exerciseFlist}
                                                       y_label_name={""} result_label_name={""}
                                                       max_y={this.state.exerciseFlist[this.state.exerciseFlist.length - 1] > 10 ?
                                                           this.state.exerciseFlist[this.state.bicycleFlist.length - 1] + 5 : 10}
                                                       max_x={1.5} color={this.yellowColor}/>
                                    <div className="f-t-label" style={{color: this.yellowColor}}>
                                        <label style={{fontSize: "1.5em"}}>t</label>
                                        <label style={{fontSize: "1em"}}>ч.</label>
                                    </div>
                                    <div className="f-f-label" style={{color: this.yellowColor}}>
                                        <label style={{fontSize: "1.5em"}}>F</label>
                                        <label style={{fontSize: "1em"}}>сила</label>
                                    </div>
                                </div>
                            </div>
                            <div className="right-speedometer-handlebar">
                                <ExBikeSpeedComponent color={this.yellowColor} time={(this.state.Tlist[this.state.Tlist.length-1])?.toString() || "0.00"} power={this.state.exercisePower}
                                                      speed={this.state.exerciseSpeed} distance={this.state.exerciseDistance} mode={this.state.curMode.toString() || "1"} isBlur={true}/>
                            </div>
                        </div>

                    </div>
                </>
        );
    }

}