const extStatusSwitch = document.getElementById('ext-status-switch')
if(extStatusSwitch){
    extStatusSwitch.addEventListener('change', function(event){
        chrome.storage.sync.get('ext-status', function (result) {
            const extStatus = result['ext-status'];
            if(extStatus == undefined){
                chrome.storage.sync.set({'ext-status': true }, getAndSendExtStatus)
            }else{
                chrome.storage.sync.set({'ext-status': !extStatus }, getAndSendExtStatus)
            }
        })
    })
}else{
    console.error("EXT SWITCH NOT FOUND")
}

getAndSendExtStatus()

function getAndSendExtStatus(){
    chrome.storage.sync.get('ext-status', function (result) {
        const extStatus = result['ext-status']
        if(extStatus != undefined){
            document.getElementById('ext-status-switch').checked=extStatus;
    
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { message: 'extension_status', extStatus });
            });
        }
    })
}
