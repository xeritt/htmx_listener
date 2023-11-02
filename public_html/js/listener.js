export function addListener(itemId, resolve, eventName = 'click') {
    let button = document.getElementById(itemId);
    if (button)
        button.addEventListener(eventName, resolve);
}

export function addListenerElement(element, resolve, eventName = 'click') {
    element.addEventListener(eventName, resolve);
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export let requestOnLoad = false;
export function getRequestOnLoad(){ return requestOnLoad; }
export function setRequestOnLoad(val){ requestOnLoad = val; }

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
    if (!button)
        return;
    button.addEventListener('click', (e) => {
        e.preventDefault();
        //e.classList.add("pressed");
        let div = document.getElementById(container);
        if (!div) {
            console.error('Error!. No target div id=' + container);
            return;
        }
        let params = prepareParams(button);
        console.log(params);
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

export async function loadDynamic(container, url, timeout = 0) {
    console.log('Start Dyn Load')
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
                //console.log(data);  
                //div.innerHTML = 'Dynamic load:' + data.text;
                div.innerHTML = data;
                //addLoadAll();
                requestOnLoad = true;
            });
    console.log('End Dyn Load')
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
    //console.log('pressed reaction ' + url);
    //loadDynamic('#' + container, url, 0);
    //}
    button.addEventListener('click', (e) => {
        console.log('Click menu');
        try {
            e.preventDefault();
            let div = document.getElementById(container);
            if (!div)
                return;
            let params = prepareParams(button);
            //console.log(params);
            fetch(url, params)
                    .then((response) => response.text())
                    .then(async (data) => {
                        //console.log(data);
                        //console.log(JSON.stringify(json, null, 2));
                        await sleep(timeout);
                        div.innerHTML = data;
                        //let state = {page: url};
                        //history.pushState(state, "", url);
                        //console.log('Push ' + url + ' state:');
                        //console.log(state);
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
    //console.log('addLoadTextAll start');
    let loadText = document.querySelectorAll(className);
    loadText.forEach(async (item) => {
        //console.log('addLoadTextAll = ' + item.id);
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
                    //console.log('id=' + newId);
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

export function addLoadAll() {
    //console.log('addLoadAll start');
    addLoadTextMenuAll();
    addLoadTextAll();
    addLinkButtonAll();
}

export function addDynamicElements(delay) {
    let resolve = () => {
        console.log('addLoadAll');
        if (getRequestOnLoad()){
            console.log('addLoadAll Request');
            addLoadAll();
            setRequestOnLoad(false);
        }    
    };
    setInterval(resolve, delay);
}


 
