import "./css/style.scss"
import css from "./js/css";
import CNV from "./js/CNV/library";
import analyze from "./js/analyzeGraph/analyze";
import save from "./js/storage/save";
import {
     setAllEndCircleClick,
    resetAllEndCircleClick,
} from "./js/eventHandlers";
import {removeEdge, createEdge} from "./js/graphHandlers";
import drawingLine from "./js/drawingLine";
import {shiftDownHandler} from "./js/shiftHandlers";

import store from "./js/Store";
import recover from "./js/storage/recover";
import zHandlers from "./js/zHandlers";
import SETTINGS from "./js/SETTINGS";
import Streams from "./API";
import firstDraw from "./js/firstDraw";
import UIhandlers from "./js/UI";

const { BRANCHES, LINE_WIDTH, STACK_LIMIT, SHOW_PATH,
    CONTROL_SUM_WARNING, STACK, SHOW_CYCLES, SHOW_PRIORITIES,
    START_POWER, NUMERIC_POWER, LINE_DIVISION, LINE_WIDTH_MIN,
    LOOPS, MERGES, FINISH_LIMITS  } = SETTINGS.getAll();


const canvas = document.querySelector("#canvas");

let context = canvas.getContext("2d");


window.onresize = (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    CNV.render();
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//Инициализация библиотеки CNV

//Базовая настройка
CNV.setContext(context);
CNV.setCanvas(canvas);
CNV.setCSS(css);
CNV.settings.draggableCanvas = false;
CNV.settings.draggableCanvasObserver = (x, y) => {
    canvas.style.backgroundPositionY = y + "px";
    canvas.style.backgroundPositionX = x + "px";
};

//запуск
CNV.start();

//Инициализация store
store.setCanvas(canvas);
store.setContext(context);

firstDraw(canvas);
//Инициализация KIO
init();

UIhandlers();


// delLineBtn.onclick = e => {
//     if(store.state.mode === "draw"){
//         setDelMode();
//     } else if(store.state.mode === "del"){
//         setDrawingMode();
//     }
// }

// recoverBtn.onclick = e => {
//     recover();
//     analyze(store.state.lines);
// }

"Object { number_of_branches: 0, number_of_plots: 0, number_of_mergers: 0, number_of_loops: 0 }"

// settings.onclick = (e) => {
//     const li = [];
//
//     for(let i = 0; i < 7; i++) {
//         li[i] = document.createElement('li');
//         li[i].classList.add("list")
//     }
//
//     if(document.querySelectorAll('.list').length === 0){
//         li[0].innerHTML = `Выводить предупреждение о контрольной сумме: ${CONTROL_SUM_WARNING}`;
//         setting_list.append(li[0]);
//         li[1].innerHTML = `Минимальная ширина линии: ${LINE_WIDTH_MIN}`;
//         setting_list.append(li[1]);
//         li[2].innerHTML = `Ширина линии: ${LINE_WIDTH}`;
//         setting_list.append(li[2]);
//         li[3].innerHTML = `Коэффициент уменьшения ширины линии: ${LINE_DIVISION}`;
//         setting_list.append(li[3]);
//         li[4].innerHTML = `Петли разрешены: ${LOOPS}`;
//         setting_list.append(li[4]);
//         li[5].innerHTML = `Слияния разрешены: ${MERGES}`;
//         setting_list.append(li[5]);
//         li[6].innerHTML = `Сохранения изменений: ${STACK}`;
//         setting_list.append(li[6]);
//     }
//
//     document.querySelector(".setting_warning").classList.toggle('hidden');
// }
//
//
// saveBtn.onclick = e => {
//     saveBtn.classList.remove("saveOk");
//     const CNVrecoveryData = CNV.save();
//     const SCRIPTrecoveryData = save({});
//     const disk = JSON.stringify({
//         CNV: CNVrecoveryData,
//         SCRIPT: SCRIPTrecoveryData,
//     })
//     savedCodeField.value = disk;
//     savedCodeField.select();
//
//     document.execCommand("copy");
//     saveBtn.classList.add("saveOk");
//     setTimeout(()=> {
//         saveBtn.classList.remove("saveOk");
//     }, 1000)
// }

window.addEventListener("keydown", shiftDownHandler);


zHandlers();

function init(){
    let query = location.search.substr(1).trim().split('&');
    let level = 0;
//TODO generalize
    for (let i = 0; i < query.length; i++) {
        if (query[i] === "level=1")
            level = 1;
        else if (query[i] === "level=2")
            level = 2;
    }

    console.log('loading task level', level);

    //document.getElementById('stud-unique-id').innerText = 'kio-task-streams-' + level;

    kio_api.initializeKioProblem(
        Streams,
        document.getElementById('problem'),
        {level: level}
    );
}


