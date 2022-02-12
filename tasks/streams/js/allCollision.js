import CNV from "./CNV/library";
import Store from "./Store";

function lineCollision(notThis = []){
    let isCollision;
    if(notThis instanceof Array === false){
        notThis = [notThis];
    }
    CNV.querySelectorAll(".line").forEach(line => {
        if(notThis.filter(item => item === line).length === 0){
            CNV.querySelectorAll(".line").forEach(curLine => {
                let curLineData = Store.state.lines[curLine.id];
                let lineData = Store.state.lines[line.id];
                let res;
                if(lineData.sideIn.filter(sideInItem => sideInItem === curLineData).length !== 0 || curLineData.sideIn.filter(sideInItem => sideInItem === lineData).length !== 0){
                    res = CNV.lineCollision(curLine, line, "lite");
                } else {
                    res = CNV.lineCollision(curLine, line);
                }


                if(res.result) {
                    isCollision = true;
                    res.target.classList.add("lineWarning");
                    line.classList.add("lineWarning");

                    // let warning = setInterval(() => {
                    //     res.target.classList.toggle("lineWarning");
                    //     line.classList.toggle("lineWarning");
                    // }, 100)
                    // setTimeout(() => {
                    //     clearInterval(warning);
                    //     res.target.classList.remove("lineWarning");
                    //     line.classList.remove("lineWarning");
                    // }, 1000)
                }
            })
        }
    })
    return isCollision;
}

export default lineCollision;