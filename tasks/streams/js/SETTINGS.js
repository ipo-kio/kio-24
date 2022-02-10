let _s = {};

// const BRANCHES = 2; //Количество линий, которые могут выходить из конца прошлой
// const STACK_LIMIT = 10; //максимальное количество сохранений в stack
// const STACK = true; //сохранине в stack изменений
// const SHOW_PATH = false //показать путь обхода
// const SHOW_CYCLES = false; //показать циклы
// const CONTROL_SUM_WARNING = true; //выводить предупреждение о контрольной сумме
// const SHOW_PRIORITIES = false;
// const START_POWER = 25;
// const NUMERIC_POWER = false;
//
// const LINE_WIDTH_MIN = 3;
// const LINE_WIDTH = 10;
// const LINE_DIVISION = 1.1;
//
// const LOOPS = true;
// const MERGES = true;
// const FINISH_LIMITS = false; //num //arr [1, 3] - range //false = no limits

_s.BRANCHES = 2; //Количество линий, которые могут выходить из конца прошлой
_s.STACK_LIMIT = 10; //максимальное количество сохранений в stack
_s.STACK = true; //сохранине в stack изменений
_s.SHOW_PATH = false //показать путь обхода
_s.SHOW_CYCLES = false; //показать циклы
_s.CONTROL_SUM_WARNING = true; //выводить предупреждение о контрольной сумме
_s.SHOW_PRIORITIES = false;
_s.START_POWER = 25;
_s.NUMERIC_POWER = false;

_s.LINE_WIDTH_MIN = 3;
_s.LINE_WIDTH = 10;
_s.LINE_DIVISION = 1.1;

_s.LOOPS = true;
_s.MERGES = true;
_s.FINISH_LIMITS = false; //num //arr [1, 3] - range //false = no limits


const SETTINGS = {
    changeProperty(name, value){
        console.log("old ", _s[name]);
        _s[name] = value;
        console.log("new ", _s[name]);

    },
    getAll(){
        return this;
    }
}
for(let key in _s){
   Object.defineProperty(SETTINGS, key, {
       get: () => {return _s[key]}
   })
}

export default SETTINGS;