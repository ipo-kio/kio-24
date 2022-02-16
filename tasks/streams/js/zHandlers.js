import recover from "./storage/recover";
import Store from "./Store";
import analyze from "./analyzeGraph/analyze";

function ctrlZHandler(){
    const nextBtn = document.querySelector("#btn_next");
    const prevBtn = document.querySelector("#btn_prev");

    nextBtn.onclick = e => {
        recover(Store.getStackNext());
        analyze(Store.state.lines);
    }

    prevBtn.onclick = e => {
        Store.showStack();
        recover(Store.getStackPrev());
        analyze(Store.state.lines);
    }


    window.addEventListener("keydown", e => {
        console.log("ctrlZHandler added e.key, e.shiftKey", e.key, e.shiftKey);
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