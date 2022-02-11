import CNV from "./CNV/library";

function lineCollision(notThis = []){
    let isCollision;
    if(notThis instanceof Array === false){
        notThis = [notThis];
    }
    CNV.querySelectorAll(".line").forEach(line => {
        if(notThis.filter(item => item === line).length === 0){
            CNV.querySelectorAll(".line").forEach(curLine => {
                let res = CNV.lineCollision(curLine, line);
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