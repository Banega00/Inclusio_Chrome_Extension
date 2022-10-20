const userInfoDiv = document.querySelector('.user-info-div');
const pageStatusDiv = document.querySelector('.page_status-div');
const sitesContainer = document.querySelector('.sites-container');

const pageCoveredText = `This page is already covered`;
const pageNotCoveredtext = `Request for Volunteers to Interpret`;
const requestSentText = `Request sent, waiting for volunteers`;
const backend_url = `http://localhost:3000`

//OPTIONS BTN
document.querySelector('.options-btn').addEventListener('click',()=>{
    chrome.runtime.openOptionsPage();
})

function getCurrentTab() {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({
            active: true,               // Select active tabs
            lastFocusedWindow: true     // In the current window
        }, function (tabs) {
            resolve(tabs[0]); //split is for trimming query params
        });
    });
}

function trimQueryParamsFromUrl(url) {
    return url.split('?')[0]
}

const extStatusSwitch = document.getElementById('ext-status-switch')
if (extStatusSwitch) {
    extStatusSwitch.addEventListener('change', changeExtStatus)
} else {
    console.error("EXT SWITCH NOT FOUND")
}

function changeExtStatus() {

    getCurrentTab().then(function (tab) {
        const currentPageUrl = trimQueryParamsFromUrl(tab.url)

        chrome.storage.sync.get('ext-status', function (result) {
            let extStatus = result['ext-status'];

            if (extStatus == undefined) { //extension status is totally empty
                extStatus = {
                    [currentPageUrl]: true
                }

                chrome.storage.sync.set({ 'ext-status': extStatus }, () => getAndSendExtStatus(currentPageUrl))
                showExtStatus(true);
            } else {
                if (typeof extStatus != 'object') extStatus = {};

                const currentPageExtStatus = extStatus[currentPageUrl];

                if (currentPageExtStatus == undefined) {

                    extStatus[currentPageUrl] = true;
                    chrome.storage.sync.set({ 'ext-status': extStatus }, () => getAndSendExtStatus(currentPageUrl))
                    showExtStatus(true)
                    return;
                } else {
                    const newStatus = extStatusSwitch.checked
                    extStatus[currentPageUrl] = newStatus
                    chrome.storage.sync.set({ 'ext-status': extStatus }, () => getAndSendExtStatus(currentPageUrl))
                    showExtStatus(newStatus);
                    return;
                }

            }
        })

    });
}

function showExtStatus(status) {
    const extStatusDiv = document.getElementById('addon-status');

    if (status) {
        extStatusDiv.innerHTML = 'Active';
    } else {
        extStatusDiv.innerHTML = 'Unactive';
    }
}


getCurrentTab().then(function (tab) {
    const currentPageUrl = trimQueryParamsFromUrl(tab.url);

    //send extension status only if true
    chrome.storage.sync.get('ext-status', function (result) {
        const extStatus = result['ext-status']

        if(extStatus && extStatus[currentPageUrl] == true){
            getAndSendExtStatus(currentPageUrl)
        }else{
            showExtStatus(false);
        }
    })
})

//get status of extension on current page and sends it to content script
function getAndSendExtStatus(currentPageUrl) {
    chrome.storage.sync.get('ext-status', function (result) {
        const extStatus = result['ext-status']
        if (extStatus != undefined) {

            const currentPageStatus = extStatus[currentPageUrl];

            if (currentPageStatus != undefined) {
                document.getElementById('ext-status-switch').checked = currentPageStatus;

                sendExtensionStatusToContentScript(currentPageStatus);
                showExtStatus(currentPageStatus);
            } else {

                sendExtensionStatusToContentScript(false);
                showExtStatus(false);
            }

        } else {
            sendExtensionStatusToContentScript(false);
            showExtStatus(false)
        }
    })
}

function sendExtensionStatusToContentScript(status) {
    chrome.storage.sync.get('user', function (result) {
        const user = result.user;
        let role;
        if (!user || !user.username || !user.role) {
            role = 'Consumer'
        } else {
            role = user.role;
        }
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: 'extension_status', status, role });
        });
    })
}

function setFirstLetter(word) {
    document.querySelector('.first-letter-div').innerHTML = word.charAt(0).toUpperCase();
}

function displayRole(role) {
    document.querySelector('.user-info-div .role-and-username-div .role-div').innerHTML = role;
}

function displayUsername(username) {
    document.querySelector('.user-info-div .role-and-username-div .username-div').innerHTML = username;
}

function getPage(pageUrl, username) {
    return new Promise(function (resolve, reject) {
        fetch(`${backend_url}/page`, {
            method: "POST",
            body: JSON.stringify({
                pageUrl, username
            }),
            headers: {
                'Content-Type': 'application/json',
            }

        }).then(response => response.json())
            .then(response => {
                if (response.status == 200) {
                    resolve(response.payload)
                } else if (response.status == 404) {
                    resolve({page:{}, requested: false})
                } else {
                    alert('Error getting page data');
                    console.log(response);
                }
            })
    })
}

function requestPage(){
    getCurrentTab()
    .then(tab => {
        const pageUrl = trimQueryParamsFromUrl(tab.url);
        const pageTitle = tab.title;
        chrome.storage.sync.get('user', function (result) {
            const user = result.user;

            if(!user || user.role != 'Consumer') {
                alert('You have to log in to request page processing')
                return;
            }

            fetch(`${backend_url}/request-page`,{
                method: 'POST',
                body: JSON.stringify({ pageUrl, pageTitle }),
                headers:{
                    Authorization: user.token,
                    'Content-Type': 'application/json'
                }
            })
            .then(response =>{
                if(!response.ok) throw new Error(response.statusText);

                alert("You've successfully requested this page to be processed by our team")
                window.location.reload()
            })
            .catch(error => {
                alert("Error requesting page to be processed")
                console.log(error)
            })
        })
    })
}

function getRequestedPages(){
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get('user', function (result) {
            const user = result.user;
            const token = user.token;
            if(!token){
                console.log("You are not authorize to fetch requested pages")
                return;
            }

            fetch(`${backend_url}/requested-pages`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
    
            }).then(response => response.json())
                .then(response => {
                    if (response.status == 200) {
                        resolve(response.payload)
                    } else {
                        alert('Error getting pages data');
                        console.log(response);
                    }
                })
        })
        
    })
}

function fetchRequestedPagesPeriodically() {
    //fetch first - then turn on interval
    getRequestedPages()
        .then(pagesArray => {
            while (sitesContainer.firstChild) {
                sitesContainer.removeChild(sitesContainer.lastChild);
            }
            pagesArray.forEach(requestedPage => {
                const pageDiv = `
                            <div class="requested-site">
                                <div class="num-of-requests">${requestedPage.requests}</div>
                                <a class="site" target="_blank"href="${requestedPage.page.page_url}">${requestedPage.page.page_title}</a>
                            </div>`
                sitesContainer.insertAdjacentHTML('beforeend', pageDiv)
            })
        })
        .catch(console.log)

    setInterval(() => {
        getRequestedPages()
            .then(pagesArray => {
                while (sitesContainer.firstChild) {
                    sitesContainer.removeChild(sitesContainer.lastChild);
                }
                pagesArray.forEach(requestedPage => {
                    const pageDiv = `
                            <div class="requested-site">
                                <div class="num-of-requests">${requestedPage.requests}</div>
                                <a class="site" target="_blank" href="${requestedPage.page.page_url}">${requestedPage.page.page_title}</a>
                            </div>`
                    sitesContainer.insertAdjacentHTML('beforeend', pageDiv)
                })
            })
            .catch(console.log)
    }, 5000)
}

getCurrentTab()
    .then(tab => {
        const pageUrl = trimQueryParamsFromUrl(tab.url);

        chrome.storage.sync.get('user', function (result) {
            const user = result.user;

            getPage(pageUrl, user?.username)
            .then(({page, requested}) => {

                if (!user || !user.username || !user.role) {
                    // userInfoDiv.innerHTML = `You are not logged in`
                } else if (user.role == 'Volunteer') {

                    sitesContainer.innerHTML = ``

                    fetchRequestedPagesPeriodically();

                    //Profile info
                    userInfoDiv.classList.remove('hidden');
    
                    setFirstLetter(user.username)
    
                    displayRole(user.role)
                    displayUsername(user.username)
    
                } else if (user.role == 'Consumer') {
                    userInfoDiv.classList.add('hidden');//user info div shown only for volunteer
                    
                    //if page doesen't exists in database that means it is not covered
                    if(!page.status) page.status = 'Not_Covered'

                    //Page status shown only for consumers
                    switch (page.status) {
                        case 'Covered':
                            pageStatusDiv.innerHTML = pageCoveredText;
                            pageStatusDiv.classList.remove('request-sent', 'not-covered')
                            pageStatusDiv.classList.add('covered')
                            pageStatusDiv.removeEventListener('click', requestPage)
                            
                            //add request for improvements div
                            const requestForImprovementsDiv = document.createElement('div');
                            requestForImprovementsDiv.classList.add('not-covered');
                            requestForImprovementsDiv.innerHTML = `Request for improvements`;
                            pageStatusDiv.appendChild(requestForImprovementsDiv);
                            requestForImprovementsDiv.addEventListener('click', requestPage)
                            break;
                        case 'Not_Covered':
                            if (requested) {//if not covered - but requested
                                pageStatusDiv.innerHTML = requestSentText;
                                pageStatusDiv.classList.remove('covered', 'not-covered')
                                pageStatusDiv.classList.add('request-sent')
                            }else{
                                pageStatusDiv.innerHTML = pageNotCoveredtext;
                                pageStatusDiv.classList.remove('request-sent', 'covered')
                                pageStatusDiv.classList.add('not-covered')
                                pageStatusDiv.addEventListener('click', requestPage)
                            }
                            break;
                    }
                }
            })
            .catch(() => alert('Error getting page data'))

            
        })


    })


function keyPress(e) {
    var evtobj = window.event ? event : e


    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {//CTRL + Z
        extStatusSwitch.checked = !extStatusSwitch.checked;
        changeExtStatus();
    }
}

document.onkeydown = keyPress;
// chrome.storage.sync.get('role', function (result) {
    
// })
