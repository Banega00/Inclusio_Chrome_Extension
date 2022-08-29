const userInfoDiv = document.querySelector('.user-info-div');
const pageStatusDiv = document.querySelector('.page_status-div');

const pageCoveredText = `This page is already covered`;
const pageNotCoveredtext = `Request for Volunteers to Interpred`;
const requestSentText = `Request sent, waiting for volunteers`;

chrome.storage.sync.get('user', function(result){
    const user = result.user;

    if(!user || !user.username || !user.role){
        userInfoDiv.innerHTML = `You are not logged in`
    }else{
        userInfoDiv.innerHTML = `${user.role}: ${user.username}`
    }
})

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

function trimQueryParamsFromUrl(url){
    return url.split('?')[0]
}

const extStatusSwitch = document.getElementById('ext-status-switch')
if(extStatusSwitch){
    extStatusSwitch.addEventListener('change', function(event){

        getCurrentTab().then(function (tab) {
            const currentPageUrl = trimQueryParamsFromUrl(tab.url)

            chrome.storage.sync.get('ext-status', function (result) {
                let extStatus = result['ext-status'];
    
                if(extStatus == undefined){ //extension status is totally empty
                    extStatus = {
                        [currentPageUrl]: true
                    }
                    
                    chrome.storage.sync.set({'ext-status': extStatus }, () => getAndSendExtStatus(currentPageUrl))
                    showExtStatus(true);
                }else{
                    if(typeof extStatus != 'object') extStatus = {};
    
                    const currentPageExtStatus = extStatus[currentPageUrl];
    
                    if(currentPageExtStatus == undefined){
    
                        extStatus[currentPageUrl] = true;
                        chrome.storage.sync.set({'ext-status': extStatus }, () => getAndSendExtStatus(currentPageUrl))
                        showExtStatus(true)
                        return;
                    }else{
                        const newStatus = event.target.checked
                        extStatus[currentPageUrl] = newStatus
                        chrome.storage.sync.set({'ext-status': extStatus }, () => getAndSendExtStatus(currentPageUrl))
                        showExtStatus(newStatus);
                        return;
                    }
    
                }
            })

        });
    })
}else{
    console.error("EXT SWITCH NOT FOUND")
}

function showExtStatus(status){
    const extStatusDiv = document.getElementById('addon-status');

    if(status){
        extStatusDiv.innerHTML = 'Active';
    }else{
        extStatusDiv.innerHTML = 'Unactive';
    }
}


getCurrentTab().then(function (tab) {
    const currentPageUrl = trimQueryParamsFromUrl(tab.url);
    getAndSendExtStatus(currentPageUrl)
})

//get status of extension on current page and sends it to content script
function getAndSendExtStatus(currentPageUrl){
    chrome.storage.sync.get('ext-status', function (result) {
        const extStatus = result['ext-status']
        if(extStatus != undefined){

            const currentPageStatus = extStatus[currentPageUrl];

            if(currentPageStatus != undefined){
                document.getElementById('ext-status-switch').checked=currentPageStatus;
        
                sendExtensionStatusToContentScript(currentPageStatus);
                showExtStatus(currentPageStatus);
            }else{

                sendExtensionStatusToContentScript(false);
                showExtStatus(false);
            }

        }else{
            sendExtensionStatusToContentScript(false);
            showExtStatus(false)
        }
    })
}

function sendExtensionStatusToContentScript(status){
    chrome.storage.sync.get('user',function(result){
        const user = result.user;
        let role;
        if(!user || !user.username || !user.role){
            role = 'Consumer'
        }else{
            role = user.role;
        }
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: 'extension_status', status, role });
        });
    })
}

fetchPageData();

function fetchPageData(){
    getCurrentTab()
    .then(tab=>{
        const pageUrl = trimQueryParamsFromUrl(tab.url);

        const response = {
            page_status: 'request_sent', //covered, not_covered, request_sent
            altText:[
            {'img_src1':'alt_text1'},
            {'img_src2':'alt_text2'}
        ]}

        switch (response.page_status) {
            case 'covered':
                pageStatusDiv.innerHTML = pageCoveredText;
                pageStatusDiv.classList.remove('request-sent', 'not-covered')
                pageStatusDiv.classList.add('covered')
                break;
            case 'not_covered':
                pageStatusDiv.innerHTML = pageNotCoveredtext;
                pageStatusDiv.classList.remove('request-sent', 'covered')
                pageStatusDiv.classList.add('not-covered')
                break;
            case 'request_sent':
                pageStatusDiv.innerHTML = requestSentText;
                pageStatusDiv.classList.remove('covered', 'not-covered')
                pageStatusDiv.classList.add('request-sent')
                break;
        }
    })
}

// chrome.storage.sync.get('role', function (result) {
    
// })
