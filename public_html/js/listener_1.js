let debug = true;
export function setDebug(val){ debug = val; } 
export function log(mes) {if (debug) console.log(mes) }
export function logerr(mes) {if (debug) console.error(mes) }
export function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}

/**
 * 
 * @type Boolean|val запрос на запуск команды AddLoadAll
 */
export let requestOnLoad = false;
export function getRequestOnLoad(){ return requestOnLoad; }
export function setRequestOnLoad(val){ requestOnLoad = val; }

let classNames = {
  addLoadTextMenuAll: '.loadTextMenu',
  addLoadTextAll: '.loadText',
  addLoadDialogAll: '.loadDialog',
  addLinkButtonAll: '.linkButton',
  addActionCloseAll: '.actionClose'
};
export function setClassNames(val){ classNames = val; }
export function getClassNames(){ return classNames; }
/*
 * 
 * Добавляет все обработчики классов
 */
export function addLoadAll() {
    const names = getClassNames();
    //log('addLoadAll start');
    addLoadTextMenuAll(names.addLoadTextMenuAll);
    addLoadTextAll();
    addLinkButtonAll();
    addLoadDialogAll(names.addLoadDialogAll);
    addActionCloseAll();
}

/** Запускает по интервалу сканирование классов
 * если есть запрос на загрузку в переменной requestOnLoad 
 * 
 * @param {type} delay интервал между запуском сканирования классов
 * @returns {undefined}
 */
export function addDynamicElements(delay) {
    let resolve = () => {
        log('addDynamicElements');
        if (getRequestOnLoad()){
            log('addLoadAll Request');
            addLoadAll();
            setRequestOnLoad(false);
        }    
    };
    setInterval(resolve, delay);
}

export function addListener(itemId, resolve, eventName = 'click') {
    let element = document.getElementById(itemId);
    if (!element) return;
    if (element.dataset.listener) return;
    element.addEventListener(eventName, resolve);
    element.dataset.listener = true;
}

export function addListenerElement(element, resolve, eventName = 'click') {
    if (!element.dataset.listener){
        log('Element Add Listener = ' + element.id);
        element.addEventListener(eventName, resolve);
        element.dataset.listener = true;
    }    
}

export function prepareParams(button) {
    let params = {};
    if (button.dataset.method) {
        params = {
            method: button.dataset.method
        };
        if (button.dataset.body) {
            params.body = JSON.stringify(button.dataset.body);
        }
        if (button.dataset.type) {
            params.headers = {
                "Content-Type": button.dataset.type
            }
        }
        if (button.dataset.mode) {
            params.mode = button.dataset.mode;
        } else {
            params.mode = "cors";//, // no-cors, *cors, same-origin
        }    
    }
    return params;
}

export function addLoadText(itemId, container, url, timeout = 0) {
    let button = document.getElementById(itemId);
    if (!button) return;
    //button.addEventListener('click', (e) => {
    addListenerElement(button, (e) => {                
        e.preventDefault();
        //e.classList.add("pressed");
        let div = document.getElementById(container);
        console.error('Click!' + container);
        if (!div) {
            console.error('Error!. No target div id=' + container);
            return;
        }
        let params = prepareParams(button);
        log(params);
        fetch(url, params)
                //fetch(url)
                .then((response) => response.text())
                .then(async (text) => {
                    await sleep(timeout);
                    div.innerHTML = text;
                    //addLoadAll();
                    requestOnLoad = true;
                });
    });
}
/**
 * Динамическая загрузка по timeout после загрузки основной страницы.
 * 
 * @param {type} container
 * @param {type} url
 * @param {type} timeout
 * @returns {undefined}
 */
export async function loadDynamic(container, url, timeout = 0) {
    log('Start Dyn Load');
    let div = document.querySelector(container);
    if (!div) {
        console.error('No container ' + container + ' to load');
        return;
    }
    await sleep(timeout);
    fetch(url)
            //.then((response) => response.json())
            .then((response) => response.text())
            .then((data) => {
                //log(data);  
                //div.innerHTML = 'Dynamic load:' + data.text;
                div.innerHTML = data;
                //addLoadAll();
                requestOnLoad = true;
                
                checkMenuItemSelect();
            });
    log('End Dyn Load');
}

export function menuReset(menu) {
    let buttons = menu.children;
    if (buttons) {
        for (let button of buttons) {
            button.classList.remove("pressed");
        }
    }
}

export function addLoadTextMenuItem(menu, item, container, url, timeout = 0) {
    let button = document.getElementById(item);
    if (!button)
        return;
    //if (button.classList.contains('pressed')) {
    //log('pressed reaction ' + url);
    //loadDynamic('#' + container, url, 0);
    //}
    //button.addEventListener('click', (e) => {
    addListenerElement(button, (e) => {        
        log('Click menu');
        try {
            e.preventDefault();
            let div = document.getElementById(container);
            if (!div)
                return;
            let params = prepareParams(button);
            //log(params);
            fetch(url, params)
                    .then((response) => response.text())
                    .then(async (data) => {
                        //log(data);
                        //log(JSON.stringify(json, null, 2));
                        await sleep(timeout);
                        div.innerHTML = data;
                        //let state = {page: url};
                        //history.pushState(state, "", url);
                        //log('Push ' + url + ' state:');
                        //log(state);
                        menuReset(menu);
                        button.classList.add("pressed");
                        // addLoadAll();
                        requestOnLoad = true;
                    });

        } catch (error) {
            console.error(`Download error: ${error.message}`);
        }
    });
}


/*
 <button id="button_load_htmx" 
 class="loadText" 
 data-url="test.html" 
 data-target="htmx"
 data-timeout="0"
 >Load htmx</button>
 <div id="htmx"></div>
 */
export function addLoadTextAll(className = '.loadText') {
    //log('addLoadTextAll start');
    let loadText = document.querySelectorAll(className);
    log(loadText);
    loadText.forEach(async (item) => {
        log('addLoadTextAll id= ' + item.id);
        addLoadText(item.id, item.dataset.target, item.dataset.url, item.dataset.timeout);
    });
}

/*
 <div id="Mymenu" data-target="page" class="loadTextMenu">
 <button data-href="/index.html">Home</button>
 <button data-url="pages/about.php" data-method="post" data-body="{i:100}" data-type="application/json">About</button>
 <button data-url="pages/contact.html">Contact</button>
 <button data-url="pages/blog.html">Blog</button>
 </div>    
 <div id="page"></div>
 */
export function addLoadTextMenuAll(className = '.loadTextMenu') {
    let loadTextMenu = document.querySelectorAll(className);
    loadTextMenu.forEach((item) => {
        let target = item.dataset.target;
        let buttons = item.children;
        if (buttons) {
            let i = 0;
            for (const button of buttons) {

                if (!button.id) {
                    let newId = item.id + '_item' + i;
                    //log('id=' + newId);
                    button.setAttribute("id", newId);
                }

                if (button.dataset.href) {
                    //button.setAttribute("title", button.dataset.href);
                    addListener(button.id, () => {
                        location.href = button.dataset.href;
                    });
                    i++;
                    continue;
                }

                if (!button.dataset.url)
                    continue;
                addLoadTextMenuItem(item, button.id, target, button.dataset.url, button.dataset.timeout);
                i++;
            }
        }
    });
}

/*
 <button data-href="http://localhost" data-confirm="Do you realy want?" class="linkButton" title="Localhost">Home</button>
 <a data-href="https://ya.ru/" data-confirm="Do you realy want?" class="linkButton" title="Ya.ru" href="#" target="_blank">Home</a>
 */
export function addLinkButtonAll(className = '.linkButton') {
    let links = document.querySelectorAll(className);
    links.forEach((item) => {
        if (item.title) {
            item.title += ' ' + item.dataset.href;
        } else {
            item.title = item.dataset.href;
        }
        addListenerElement(item, (e) => {
            e.preventDefault();
            if (item.dataset.confirm) {
                if (confirm(item.dataset.confirm)) {
                    location.href = item.dataset.href;
                }
                return false;
            }
            location.href = item.dataset.href;
        });
    });
}


/*
<nav class="aside-menu">
    <div class="aside-menu__item"><a href="index.html" class="aside-menu__item-link is-active">Главная</a></div>
    <div class="aside-menu__item"><a href="records.html" class="aside-menu__item-link">Записи лекций</a></div>
    <div class="aside-menu__item"><a href="protection.html" class="aside-menu__item-link">Защита проектов</a></div>
    <div class="aside-menu__item"><a href="projects.html" class="aside-menu__item-link">Лучшие проекты</a></div>
    <div class="aside-menu__item"><a href="photo.html" class="aside-menu__item-link">Фотоальбом</a></div><div class="aside-menu__item"><a href="press.html" class="aside-menu__item-link">СМИ о Школе</a></div>
    <div class="aside-menu__item"><a href="register.html" class="aside-menu__item-link">Регистрация</a></div>
    <div class="aside-menu__item"><a href="https://chat.whatsapp.com/KE1QfA66hFU09It1nuSyGf" class="aside-menu__item-link">Обратная связь</a></div>
</nav>
*/
export function checkMenuItemSelect(className = '.aside-menu'){
    let loadTextMenu = document.querySelectorAll(className);
    log('loadTextMenu=', loadTextMenu);
    loadTextMenu.forEach((item) => {
        //let target = item.dataset.target;
        let divs = item.children;
        //log('divs=', divs);
        //let activeIndex = -1; 
        for (let i = 0; i < divs.length; i++) {
        //divs.forEach((div) => {
            //log('div=', divs[i].children[0]);
            let lnk = divs[i].children[0];
            if (lnk) {
                let url = lnk.href;
                let menufilename = url.substring(url.lastIndexOf('/') + 1);
                
                let wurl = window.location.pathname;
                let wfilename = wurl.substring(wurl.lastIndexOf('/') + 1);
                //log('lnk.href', menufilename, wfilename);
                if (wfilename === menufilename){
                    lnk.classList.add('is-active');
                    break;
                    //activeIndex = i;
                } 
           }    
        }
        //if (activeIndex > -1){
          //  let lnk = divs[activeIndex].children[0];
            //lnk.classList.add('is-active');
        //}
        
    });    
}

export function addLoadDialog(itemId, container, url, timeout = 0) {
    let button = document.getElementById(itemId);
    if (!button) return;
    //if (button.getAttribute('listener') === 'true') return;
    addListenerElement(button, (e) => {
    //button.addEventListener('click', (e) => {
        e.preventDefault();
        //e.classList.add("pressed");
        let div = document.getElementById(container);
        log('Click!' + container);
        if (!div) {
            console.error('Error!. No target div id=' + container);
            return;
        }
        let params = prepareParams(button);
        log(params);
        fetch(url, params)
                //fetch(url)
                .then((response) => response.text())
                .then(async (text) => {
                    await sleep(timeout);
                    div.innerHTML = text;

                    const scriptName = itemId + '-script';
                    let dialogScript = document.getElementById(scriptName);
                    if (dialogScript == null){
                        let dialogUrl = url + '.js';
                        log('Load Dialog script ' + scriptName);
                        try {
                            let sc = document.createElement('script');
                            sc.setAttribute('id', scriptName);
                            sc.setAttribute('src', dialogUrl);
                            sc.setAttribute("type", "text/javascript"); 
                            document.head.appendChild(sc);
                        } catch (error) {
                          logerr(error);
                        }
                    }
                    
                    setRequestOnLoad(true);
                    const dialog = document.getElementById(container);
                    log('Load dialog id=' + container);
                    log(dialog);
                    dialog.showModal();
                });
    });
}

 
/*
 <button id="button_load_htmx" 
 class="loadText" 
 data-url="test.html" 
 data-target="htmx"
 data-timeout="0"
 >Load htmx</button>
 <dialog id="htmx"></dialog>
 */
export function addLoadDialogAll(className = '.loadDialog') {
    //log('addLoadTextAll start');
    let loadText = document.querySelectorAll(className);
    log(loadText);
    loadText.forEach(async (item) => {
        log('addLoadDialogAll id= ' + item.id);
        addLoadDialog(item.id, item.dataset.target, item.dataset.url, item.dataset.timeout);
    });
}


/*
 <button id="closeDialog" 
 class="actionClose" 
 data-target="htmx"
 >Load htmx</button>
 <dialog id="htmx"></dialog>
 */
export function addActionCloseAll(className = '.actionClose') {
    //log('addLoadTextAll start');
    let loadText = document.querySelectorAll(className);
    log(loadText);
    loadText.forEach(async (item) => {
        log('addActionCloseAll id= ' + item.id);
        addListenerElement(item, (e) => {
        //item.addEventListener("click", () => {
          const dialog = document.getElementById(item.dataset.target);  
          log('close dialog listener');
          dialog.close();
        });
        
        //addLoadDialog(item.id, item.dataset.target, item.dataset.url, item.dataset.timeout);
    });
}