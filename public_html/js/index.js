import {loadDynamic, addLoadAll, addDynamicElements} from "./listener.js";

//On ajax button
//addLoadAll();

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded');
});

window.addEventListener('load', (event) => {
    console.log('The page has fully loaded');
    //let div = document.querySelector('.pressed'); 
    loadDynamic('#page', 'pages/index.html', 0);
    //addLoadAll();
    addDynamicElements(1000);  
});

window.addEventListener('popstate', function (event) {
    //history.pushState(null, document.title, location.href);
    console.log("State received: ", event);
    console.log('history.pushState');
    //if (event.state){
    //location.replace('/HTML5Application/index.html');
    //}  
});