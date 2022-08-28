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
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: 'extension_status', status });
    });
}

// chrome.storage.sync.get('role', function (result) {
    
// })
