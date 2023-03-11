import {Component} from "react";
import "./BikeSpeedStyle.css";

type SpeedometerProps = {
    left?: string,
    right?: string,
    speed?: number,
    distance?: number,
    color: string,
    isBlur?: boolean
}

export default class BikeSpeedComponent extends Component {
    props: SpeedometerProps;

    constructor(props: SpeedometerProps) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <>
                <div className="bike-speedometer-container" style={{boxShadow: "0 0 0 10px" + this.props.color}}>
                    <div className={this.props.isBlur ? "bike-speed-box blur-mode" : "bike-speed-box"}>
                        <div className="bike-derailleurs bike-left-box">
                            <text className="inbox-title" >GEARS</text>
                            <section style={{flexDirection:"column", height:"100%", gap: "8px", marginTop: "16px", fontSize: "36px"}}>
                                {/*  10 curr dist*/} {this.props.left}
                                <text style={{fontSize: "18px", alignSelf: "flex-end", marginRight: "35px"}}>LEFT</text>
                            </section>
                        </div>
                        <div className="bike-derailleurs bike-right-box">
                            {/*<text className="inbox-title">RIGHT</text>*/}
                            <section style={{flexDirection:"column", height:"100%", gap: "8px", marginTop: "16px", fontSize: "36px"}}>
                                {/*  10 curr gear x*/} {this.props.right}
                                <text style={{fontSize: "18px", alignSelf: "flex-end", marginRight: "35px"}}>RIGHT</text>
                            </section>
                        </div>
                    </div>
                    <div className={this.props.isBlur ? "bike-speed-box blur-mode" : "bike-speed-box"}>
                        <text className="inbox-title">speed</text>
                        <section style={{fontSize: "42px"}}>
                            {/*  10 curr speed*/} {this.props.speed}
                            <text>KM/H</text>
                        </section>
                    </div>
                    <div className={this.props.isBlur ? "bike-speed-box blur-mode" : "bike-speed-box"}>
                        <text className="inbox-title">DISTANCE</text>
                        <section style={{fontSize: "42px", marginTop: "20px"}}>
                            {/*  10 curr dist*/} {this.props.distance}
                            <text>KM</text>
                        </section>
                    </div>
                </div>
            </>
        );
    }
}