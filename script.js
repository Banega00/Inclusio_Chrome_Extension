const extStatusSwitch = document.getElementById('ext-status-switch')
if(extStatusSwitch){
    extStatusSwitch.addEventListener('change', function(event){
        chrome.storage.sync.get('ext-status', function (result) {
            const extStatus = result['ext-status'];
            if(extStatus == undefined){
                chrome.storage.sync.set({'ext-status': true })
            }else{
                chrome.storage.sync.set({'ext-status': !extStatus })
            }
        })
    })
}else{
    console.error("EXT SWITCH NOT FOUND")
}

chrome.storage.sync.get('ext-status', function (result) {
    const extStatus = result['ext-status']
    if(extStatus){
        document.getElementById('ext-status-switch').checked=true;
    }
})
