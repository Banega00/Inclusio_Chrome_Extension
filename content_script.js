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
`

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

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