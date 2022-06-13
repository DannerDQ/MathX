const byId = selector => document.getElementById(selector);
const buttons = byId('buttons');
const subscreen1 = byId('subscreen1');
const subscreen2 = byId('subscreen2')
let evento,open = 0, close = 0;
let nodeArray = [],nodeArray2 = [];
let screenArray = [], screenArray2 = [];
let operation = [],operation2 = [];
let point = true;

buttons.addEventListener('click', e => {
    evento = e.target.attributes.id.value;
    if(evento.match(/\d+/) !== null)operator(evento,evento,'number');
    if(evento.match(/[+*/^%-]/) !== null)operator(evento,evento,'operator');
    if(evento === "=")operator('=','',null);
    if(evento === ".")operator('.','.','point');
    if(evento === "±")operator('±','','plusOrMinus');
    if(evento === "raizcubica")operator('Math.cbrt(','³√(','open');
    if(evento === "raizcuadrada")operator('Math.sqrt(', '²√(','open');
    if(evento === "ahead")position('avanzar');
    if(evento === "behind")position('retroceder');
    if(evento === "(")operator('(','(','open');
    if(evento === ")")operator(')',')','close');
    if(evento === "CE")operator('B','',null);
    if(evento === "C")operator('L','',null);
})

function operator(node,display,IaN){
    
    subscreen1.scrollTop = subscreen1.scrollHeight;
    subscreen2.scrollTop = subscreen2.scrollHeight;

    if(node.match(/[\d.]/g) === null)point = true;
    if(IaN !== null)operation.push(IaN);
    if(operation[operation.length-2] === 'number' && operation[operation.length-1] === 'open' ||
    operation[operation.length-2] === 'close' && operation[operation.length-1] === 'open')nodeArray.push('*');
    if(node == nodeArray2[0]){nodeArray2.shift();screenArray2.shift();operation2.shift()} 

    switch (node) {
        case 'L':
            open = 0; close = 0;
            operation = []; operation2 = [];
            nodeArray = []; nodeArray2 = [];
            screenArray = []; screenArray2 = [];
            subscreen1.innerText = screenArray.join('');
            subscreen2.innerText = screenArray2.join('');
            break;
        case 'B':
            nodeArray.pop();
            screenArray.pop();
            operation.pop();
            if(nodeArray.join('') === ""){
                nodeArray2 = [];
                screenArray2 = [];
                operation2 = [];
            }
            subscreen1.innerText = screenArray.join('');
            subscreen2.innerText = screenArray2.join('');
            break;
        case '±':
            if(nodeArray[0] == "-"){
                nodeArray.shift();
                screenArray.shift();
            }else {
                nodeArray.unshift('-');
                screenArray.unshift('-');
            }
            break;
        case '=':
            operation = operation.concat(operation2);
            let a = nodeArray.join('') + nodeArray2.join('');
            let resultado = eval(a);
            nodeArray = []; screenArray = [];
            nodeArray2 = []; screenArray2 = [];
            operation = []; operation2 = [];
            nodeArray.push(resultado);
            screenArray.push(resultado);
            operation.push('number');
            subscreen1.innerText = resultado;
            subscreen2.innerText = screenArray2;

            break;
        case '.':
            if(point){
                nodeArray.push(node);
                screenArray.push(display);
                point = false;
            }
            break;
        default:
            nodeArray.push(node);
            screenArray.push(display);
            break;
    }
    if(node.match(/\(/) !== null){
        nodeArray2.unshift(')'); screenArray2.unshift(')'); operation2.unshift('close');
    };

    for(i of nodeArray){
        if(i.match(/\(/) !== null)open++;
        if(i.match(/\)/) !== null)close++;
    }
    for(i of nodeArray2){
        if(i.match(/\(/) !== null)open++;
        if(i.match(/\)/) !== null)close++;
    }
    if(open > close){
        screenArray2.push(')'); nodeArray2.push(')'); operation2.push('close');
        close++;
    }else if(open < close){
        if(nodeArray2.indexOf(')') !== -1){
            nodeArray2.splice(nodeArray2.indexOf(')'), 1);
            screenArray2.splice(screenArray2.indexOf(')'), 1);
            operation2.splice(operation2.indexOf('close'), 1);
        }else{
            nodeArray.splice(nodeArray.lastIndexOf(')'), 1);
            screenArray.splice(screenArray.lastIndexOf(')'), 1);
            operation.splice(operation.lastIndexOf('close'), 1);
        }
        close--;
    }
    
    subscreen1.innerText = screenArray.join('');
    subscreen2.innerText = screenArray2.join('');
    open = 0, close = 0;

}

function position(action){

    switch (action) {
        case 'retroceder':
            if(nodeArray.join('') !== ""){
                nodeArray2.unshift(nodeArray.pop());
                screenArray2.unshift(screenArray.pop());
                operation2.unshift(operation.pop());
                subscreen1.innerText = screenArray.join('');
                subscreen2.innerText = screenArray2.join('');
            }
            break;
        case 'avanzar':
            if(nodeArray2.join('') !== ""){
                nodeArray.push(nodeArray2.shift());
                screenArray.push(screenArray2.shift());
                operation.push(operation2.shift());
                subscreen1.innerText = screenArray.join('');
                subscreen2.innerText = screenArray2.join('');
            }
            break;
    }
}
