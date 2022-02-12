import recover from "./storage/recover";
import Store from "./Store";
import analyze from "./analyzeGraph/analyze";

function ctrlZHandler(){
    window.addEventListener("keydown", e => {
        console.log("ctrlZHandler added");
        if(e.key === "Z" && e.ctrlKey && e.shiftKey){
            console.log("ctrlShiftZ");
            console.log("stack", Store.stack);
            recover(Store.getStackNext());
            analyze(Store.state.lines);
        }  else if(e.key === "z" && e.ctrlKey){
            console.log("crtlZ");
            Store.showStack();
            recover(Store.getStackPrev());
            analyze(Store.state.lines);
        }
    })
}

export default ctrlZHandler;