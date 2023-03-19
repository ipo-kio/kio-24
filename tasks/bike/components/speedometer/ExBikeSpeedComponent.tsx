import {Component} from "react";
import "./ExBikeSpeedStyle.css";

type SpeedometerProps = {
    time?: string,
    power?: number,
    speed: number,
    distance?: number,
    mode?: string,
    color: string,
    isBlur?: boolean
}

export default class ExBikeSpeedComponent extends Component {
    props: SpeedometerProps;

    constructor(props: SpeedometerProps) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <>
                <div className="ex-bike-speedometer-container" style={{boxShadow: "0 0 0 10px " + this.props.color}}>
                    <div className={this.props.isBlur ? "ex-bike-speed-box blur-mode" : "ex-bike-speed-box"} style={{marginTop: "-20px"}}>

                            <div className={this.props.isBlur ? "ex-bike-speed-box-2 blur-mode" : "ex-bike-speed-box-2"} style={{maxHeight: "55px"}}>
                                <text className="inbox-title"  style={{fontSize: "20px", top: "21px"}}>MODE</text>
                                <section style={{fontSize: "40px"}}>
                                    <text style={{fontSize: "30px"}}>{this.props.mode}</text>
                                    {/*<text style={{fontSize: "20px"}}>KM/H</text>*/}
                                </section>
                            </div>
                    </div>
                    <div className={this.props.isBlur ? "ex-bike-speed-box-2 blur-mode" : "ex-bike-speed-box-2"}>
                        <div className="hbox">
                            <div className={this.props.isBlur ? "ex-bike-speed-box-2 blur-mode" : "ex-bike-speed-box-2"}
                                 style={{width: "60%", height: "100%"}}>
                                <text className="inbox-title">time</text>
                                <section style={{fontSize: "56px"}}>
                                    <text style={{fontSize: "30px"}}>{this.props.time}</text>
                                </section>
                            </div>
                            <div className={this.props.isBlur ? "ex-bike-speed-box-2 blur-mode" : "ex-bike-speed-box-2"}
                                 style={{width: "40%", height: "100%"}}>
                                <text className="inbox-title">power</text>
                                <section style={{fontSize: "56px"}}>
                                    <text style={{fontSize: "30px"}}>{this.props.power}</text>
                                    <text style={{fontSize: "20px"}}>U</text>
                                </section>
                            </div>
                        </div>
                    </div>
                    <div className={this.props.isBlur ? "ex-bike-speed-box-2 blur-mode" : "ex-bike-speed-box-2"}>
                        <text className="inbox-title">speed</text>
                        <section style={{fontSize: "56px"}}>
                            <text style={{fontSize: "30px"}}>{this.props.speed}</text>
                            <text style={{fontSize: "20px"}}>KM/H</text>
                        </section>
                    </div>
                    <div className={this.props.isBlur ? "ex-bike-speed-box-2 blur-mode" : "ex-bike-speed-box-2"}>
                        <text className="inbox-title">DISTANCE</text>
                        <section style={{fontSize: "56px"}}>
                            <text style={{fontSize: "32px"}}>{this.props.distance}</text>
                            <text style={{fontSize: "20px"}}>KM</text>
                        </section>
                    </div>
                </div>
            </>
        );
    }
}