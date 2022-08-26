const css = `
.extension-header {
    overflow: hidden;
    background-color: white;
    position: fixed;
    /* Set the navbar to fixed position */
    top: 0;
    /* Position the navbar at the top of the page */
    width: 100%;
    /* Full width */
    height: 100px;
    box-shadow: 0px 5px 11px -1px rgba(0,0,0,0.75);
    z-index: 10;
}

.img-wrapper-div{
    padding: 20px;
}

.neutral{
    background-color: gray;
}

.no-alt-text{
    background-color: red;
}

.wrapper-controls{
    color: white;
    padding: 5px;
    font-size: 1.4em;
}
`

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch(request.message){
            case 'extension_status':
                extensionStatusChange(request.extStatus)
            break;
        }

        const body = document.querySelector('body')
        const header = document.createElement('div')
        header.innerHTML = '<div>Pozdrav brate</div>'
        header.classList = "extension-header"

        loadCSS(css);
        body.appendChild(header)
    }
)

function loadCSS(css) {
    var head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.id = "extension";
    style.textContent = css;
    head.appendChild(style);
}

function extensionStatusChange(extStatus){
    if(extStatus){
        const images = document.querySelectorAll('img');
        images.forEach(img=>{
            const parent = img.parentNode
            const wrapper = document.createElement('div')
            wrapper.classList.add('img-wrapper-div')


            const wrapperControls = document.createElement('div');
            wrapperControls.classList.add('wrapper-controls')
            let imageStatusMessage = ''
            const altText = img.alt ?? '';
            if(altText.trim()){
                wrapper.classList.add('no-alt-text')
                imageStatusMessage = 'Alt text missing'
            }else{
                wrapper.classList.add('neutral')
                imageStatusMessage = 'Alt text available'
            }

            parent.replaceChild(wrapper, img);
            wrapper.appendChild(img);

            wrapperControls.innerHTML = `<div>${imageStatusMessage}</div>`
            wrapper.appendChild(wrapperControls)
        })
    }
}