import {loadDynamic, addLoadAll, addDynamicElements, log, setDebug} from "./listener_1.js";

//On ajax button
//addLoadAll();

document.addEventListener('DOMContentLoaded', function () {
    setDebug(true);
    log('DOMContentLoaded');
});

window.addEventListener('load', (event) => {
    
    log('The page has fully loaded');
    //let div = document.querySelector('.pressed'); 
    loadDynamic('#page', 'pages/index.html', 0);
    //addLoadAll();
    addDynamicElements(1000);  
});

window.addEventListener('popstate', function (event) {
    //history.pushState(null, document.title, location.href);
    log("State received: ", event);
    log('history.pushState');
    //if (event.state){
    //location.replace('/HTML5Application/index.html');
    //}  
});