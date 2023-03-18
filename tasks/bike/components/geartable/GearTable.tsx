import React, {Component} from "react";


let gear12 = "/bike-resources/Vector12.svg"
let gear14 = "/bike-resources/Vector14.svg"
let gear16 = "/bike-resources/Vector16.svg"
let gear18 = "/bike-resources/Vector18.svg"
let gear21 = "/bike-resources/Vector21.svg"
let gear24 = "/bike-resources/Vector24.svg"
let gear34 = "/bike-resources/Vector34.svg"
let gear44 = "/bike-resources/Vector44.svg"

import "./GearTable.css";
import {KioApi} from "../../../KioApi";

type Props = {
    tableData: number[][]
    onChange: (arr: number[][]) => void
    selectedSpeedX?: number
    selectedSpeedY?: number
    lockSpeed: boolean
    kioApi: KioApi
}

enum HighlightType {
    NONE,
    COLORED,
    SEMI_COLORED
}

// TODO: fix text color and width
type CellData = {
    x: number,
    y: number,
    value: number
    highlighted: HighlightType
}

type State = {
    cells: CellData[][]
}

export default class GearTable extends Component {

    public props: Props;

    public state: State;

    constructor(props: Props) {
        super(props);
        this.props = props;

        console.log("base path is -------------", this.props.kioApi.basePath)

        if (this.props.kioApi.basePath){
            gear12 =props.kioApi.basePath + "/bike-resources/Vector12.svg"
            gear14 =props.kioApi.basePath + "/bike-resources/Vector14.svg"
            gear16 =props.kioApi.basePath + "/bike-resources/Vector16.svg"
            gear18 =props.kioApi.basePath + "/bike-resources/Vector18.svg"
            gear21 =props.kioApi.basePath + "/bike-resources/Vector21.svg"
            gear24 =props.kioApi.basePath + "/bike-resources/Vector24.svg"
            gear34 =props.kioApi.basePath + "/bike-resources/Vector34.svg"
            gear44 =props.kioApi.basePath + "/bike-resources/Vector44.svg"
        }
        else {
            gear12 ="." + "/bike-resources/Vector12.svg"
            gear14 ="." + "/bike-resources/Vector14.svg"
            gear16 ="." + "/bike-resources/Vector16.svg"
            gear18 ="." + "/bike-resources/Vector18.svg"
            gear21 ="." + "/bike-resources/Vector21.svg"
            gear24 ="." + "/bike-resources/Vector24.svg"
            gear34 ="." + "/bike-resources/Vector34.svg"
            gear44 ="." + "/bike-resources/Vector44.svg"
        }



        this.state = {
            cells: [[]]
        }

    }

    componentDidMount() {

        let cells: CellData[][] = []

        for (let x in this.props.tableData) {
            cells.push([])
            for (let y in this.props.tableData[x]) {
                cells[x].push({x: +x, y: +y, value: +this.props.tableData[x][y], highlighted: HighlightType.NONE})
            }
        }

        this.setState({
            cells: cells
        })

        // this.props.onChange(this.get2dArray())

    }

    private get2dArray = () => {
        let array2 = this.state.cells.map((row) => {
            return row.map((cell) => {
                if (cell.value === 0){
                    return 1
                }
                return cell.value
            })
        })
        return array2;
    }

    forall = (apply: (cell: CellData) => void) => {
        for (let x in this.state.cells) {
            for (let y in this.state.cells[x]) {
                apply(this.state.cells[x][y])
            }
        }
    }

    highlightCell = (x: number, y: number) => {

        this.forall((cell) => {
            cell.highlighted = HighlightType.NONE
        })

        let cells = this.state.cells;

        for (let x_i in cells) {
            cells[x_i][y].highlighted = HighlightType.SEMI_COLORED
        }
        for (let y_i in cells[x]) {
            cells[x][y_i].highlighted = HighlightType.SEMI_COLORED
        }

        cells[x][y].highlighted = HighlightType.COLORED

        this.setState({
            cells: cells
        })
    }

    private getHighlightedStyle(highlighted: HighlightType) {
        if (highlighted === HighlightType.COLORED) {
            return "highlighted-colored"
        }
        if (highlighted === HighlightType.SEMI_COLORED) {
            return "highlighted-semi-colored"
        }
        return ""
    }

    render() {

        let cells = [];

        for (let row in this.state.cells) {
            for (let cellData in this.state.cells[row]) {

                cells.push(
                    <input
                        onChange={(e) => {
                            const inp = +e.target.value

                            if (!(inp >= 0 && inp <= 12)) {
                                return 1
                            }

                            let tableData = this.state.cells
                            tableData[row][cellData].value = inp // TODO: validation
                            this.setState({
                                cells: tableData
                            })

                        }}
                        onFocus={(e) => {
                            this.highlightCell(+row, +cellData)
                        }}

                        onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    this.props.onChange(this.get2dArray())
                                }
                            }
                        }

                        onBlur={(e) => {
                                this.props.onChange(this.get2dArray())
                            }
                        }

                        value={this.state.cells[row][cellData].value}
                        className={this.getHighlightedStyle(this.state.cells[row][cellData].highlighted) + " cell"}
                    />)
            }
        }

        let topgears = [
            <img src={gear44}/>,
            <img src={gear34} style={{scale: "0.65"}}/>,
            <img src={gear24}/>,
        ].reverse()

        let topgearsN = [
            24, 34 , 44
        ].reverse()

        let leftgearsN = [
            12,14,16,18,21,24
        ]

        let leftgears = [
            <img src={gear12}/>,
            <img src={gear14}/>,
            <img src={gear16}/>,
            <img src={gear18}/>,
            <img src={gear21}/>,
            <img src={gear24}/>,
        ].reverse()

        let topPanel = [];  // panels vise-versa
        for (let cell in this.state.cells) {
            topPanel.push(<div style={{transform: "scale(0.7)", position: "relative"}} className="top-panel-cell" >{topgears[+cell]} <p style={{position: "absolute"}}> {topgearsN[+cell]} </p></div>)
        }

        let leftPanel = [];
        for (let cell in this.state.cells[0]) {
            leftPanel.push(<div style={{transform: "scale(0.7)", position: "relative"}} className="left-panel-cell">{leftgears[+cell]}  <p style={{position: "absolute"}}> {leftgearsN[+cell]} </p></div>)
        }

        let x = this.props.selectedSpeedX!;
        let y = this.props.selectedSpeedY!;
        if (this.props.lockSpeed){
            leftPanel[y] = <div style={{transform: "scale(0.7)", position: "relative"}} className="left-panel-cell highlighted-colored">{leftgears[y]}  <p style={{position: "absolute"}}> {leftgearsN[y]} </p></div>
            topPanel[x] = <div style={{transform: "scale(0.7)", position: "relative"}} className="top-panel-cell highlighted-colored">{topgears[x]} <p style={{position: "absolute"}}> {topgearsN[x]} </p></div>
        }
        else {
            for (let x in this.state.cells) {
                for (let y in this.state.cells[x]) {
                    if (this.state.cells[x][y].highlighted == HighlightType.COLORED) {
                        leftPanel[y] = <div style={{transform: "scale(0.7)", position: "relative"}} className="left-panel-cell highlighted-colored">{leftgears[+y]}  <p style={{position: "absolute"}}> {leftgearsN[+y]} </p></div>
                        topPanel[x] = <div style={{transform: "scale(0.7)", position: "relative"}} className="top-panel-cell highlighted-colored">{topgears[+x]} <p style={{position: "absolute"}}> {topgearsN[+x]} </p></div>
                    }
                }
            }
        }



        return (
            <div>
                <div className="outer">
                    <div className="top">
                        {topPanel}
                    </div>
                    <div className="left">
                        {leftPanel}
                    </div>
                </div>

                <div style={{gridTemplateColumns: `repeat(${this.props.tableData[0].length}, 55px)`}} className="table">
                    {cells}
                </div>
            </div>

        )
    }

}
