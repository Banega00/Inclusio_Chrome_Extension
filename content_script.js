const editIconSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512">
<g>
  <g>
    <path d="m179.2,410.4l-77.3-77.4 272.5-272.9 77.3,77.4-272.5,272.9zm-96-38.3l56.9,57-79.2,22.3 22.3-79.3zm411.8-249l-106.2-106.4c-7.7-7.7-21.2-7.7-28.9-3.55271e-15l-301.3,301.8c-2.5,2.5-4.3,5.5-5.2,8.9l-41.6,148c-2,7.1 0,14.8 5.2,20 3.9,3.9 11.7,6.7 20,5.2l147.8-41.7c3.4-0.9 6.4-2.7 8.9-5.2l301.3-301.7c8-8 8-20.9 0-28.9z"/>
  </g>
</g>
</svg>`
const prevImgSvg = `<svg version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
<metadata>
    <sfw xmlns="&ns_sfw;">
        <slices></slices>
        <sliceSourceBounds width="505" height="984" bottomLeftOrigin="true" x="0" y="-120">
        </sliceSourceBounds>
    </sfw>
</metadata>
<g>
    <g>
        <g>
            <path d="M12,24C5.4,24,0,18.6,0,12S5.4,0,12,0s12,5.4,12,12S18.6,24,12,24z M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10
S17.5,2,12,2z" />
        </g>
    </g>
    <g>
        <g>
            <path d="M13,16c-0.3,0-0.5-0.1-0.7-0.3l-3-3c-0.4-0.4-0.4-1,0-1.4l3-3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L11.4,12l2.3,2.3
c0.4,0.4,0.4,1,0,1.4C13.5,15.9,13.3,16,13,16z" />
        </g>
    </g>
</g>
</svg>`
const inclusioPinkColor = '#ca3f64';

const galleryCSS= `
.galleryDiv.hidden{
    display: none;
}

.galleryDiv .close-btn {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
    margin-top: 10vh;
}

.galleryDiv .close-btn svg {
    fill: white;
    width: 64px;
    height: 64px;
    color: white;
}

.galleryDiv .img-div {
    width: 17vw;
    height: 17vw;

    min-width: 170px;
    min-height: 170px;
}

.galleryDiv .img-div img {
    width: 100%;
    height: 100%;
}

.galleryDiv .img-div.main {
    width: 30vw;
    height: 30vw;

    min-width: 300px;
    min-height: 300px;
}

.galleryDiv .carousel {
    width: 100%;
    display: flex;
    margin: auto;
    align-items: center;
    justify-content: center;
}

.galleryDiv .carousel>* {
    margin: 0px 20px;
}

.galleryDiv .text-area-div>div {
    padding-top: 20px;
    margin: auto;
    text-align: center;
    display: flex;
    justify-content: center;
}

.galleryDiv .text-area-div>div textarea {
    width: 30vw;
}

.galleryDiv .next-img-svg-div svg, .prev-img-svg-div svg{
    color: white;
    fill: white;
    width: 32px;
    height: 32px;
    cursor: pointer;
}

.galleryDiv .next-img-svg-div{
    transform: rotateY(180deg);
}`
const css = `
*{
    box-sizing: border-box;
}

body{
    height: auto !important;
}

.extension-header {
    overflow: hidden;
    background-color: white;
    position: sticky;
    height: 10vh;
    box-shadow: 0px 5px 11px -1px rgba(0,0,0,0.75);
    top:0;
    z-index: 10;

    padding: 10px;

    display: flex;
    align-items: flex-end;
}

.extension-header .selected-image.has-alt-text{
    color: #2DC257;
}

.extension-header .selected-image.no-alt-text{
    color: ${inclusioPinkColor};
}

.extension-header .logo{
    color: ${inclusioPinkColor};
    font-size: 1.75em;
    font-weight: bold;
    padding-left: 20px;
}

.extension-header .selected-image{
    flex: 1;
    text-align: center;
    font-size: 1.2em;
}

.extension-header .discardBtn{
    color: ${inclusioPinkColor};
    border: 3px solid ${inclusioPinkColor};
    padding: 3px 10px;
    border-radius: 9999px;

}

.extension-header .saveBtn{
    background-color: ${inclusioPinkColor};
    border: 3px solid ${inclusioPinkColor};
    padding: 3px 10px;
    color: white;
    border-radius: 9999px;
}

.vr{
    height: 2em;
    border: 1px solid gray;
    background-color: gray;
    margin: 0 10px;
}


.img-wrapper-div{
    border: 5px solid black;
}

.img-wrapper-div .wrapper-controls{
    display: flex;
    align-items: flex-end;
}

.img-wrapper-div .wrapper-controls .img-alt-text-div{
    font-size: 1rem;
}

.img-wrapper-div .wrapper-controls .hidden{
    display: none;
}

.img-wrapper-div .edit-icon-div svg{
    margin-left: 10px;
    width: 1.2em;
    height: 1.2em;
    fill: white;
}

.img-wrapper-div .edit-icon-div{
    cursor: pointer;
}

.img-wrapper-div.has-alt-text{
    border-color: #2DC257;
    background-color: #2DC257;
}

.img-wrapper-div.no-alt-text{
    border-color: ${inclusioPinkColor};
    background-color: ${inclusioPinkColor};
}

.wrapper-controls{
    color: white;
    padding: 5px;
    font-size: 1.4em;
}

.galleryDiv{
    position:fixed;
    padding:0;
    margin:0;
    padding-top: 15vh;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.75);
    overflow: auto;
}

${galleryCSS}
`

let selectedImgRef = undefined;

let galleryImagesArray = [];

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch(request.message){
            case 'extension_status':
                extensionStatusChange(request.status)
            break;
        }
    }
)

const debounce = (fn, delay) => {
    let timeoutID; // Initially undefined

    return function (...args) {

        // cancel previously unexecuted timeouts
        if (timeoutID) {
            clearTimeout(timeoutID);
        }

        timeoutID = setTimeout(() => {
            fn(...args);
        }, delay)
    }
}

function loadCSS(css) {
    var head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.id = "extension";
    style.textContent = css;
    head.appendChild(style);
}

function trimQueryParamsFromUrl(url){
    return url.split('?')[0]
}

function setAltTextOfImageArrayToStorage(imgArray) {
    const pageUrl = trimQueryParamsFromUrl(window.location.href);

    chrome.storage.local.get('alt_text', function (result) {
        let altTextObject = result.alt_text;

        if (!altTextObject) altTextObject = {};

        let currentPageAltText = altTextObject[pageUrl];

        if (!currentPageAltText) {
            currentPageAltText = {};
        }

        imgArray.forEach(img => {
            currentPageAltText[img.src] = img.alt ?? ''
        })

        altTextObject[pageUrl] = currentPageAltText;
        chrome.storage.local.set({'alt_text' : altTextObject})
    })
}

function getImageAltTextFromStorage(imgSrc){
    const pageUrl = trimQueryParamsFromUrl(window.location.href);

    return new Promise(function (resolve, reject) {
        chrome.storage.local.get('alt_text', function (result) {
            let altTextObject = result.alt_text;
    
            if(altTextObject){
                if(altTextObject[pageUrl]){
                    resolve(altTextObject[pageUrl][imgSrc])
                }
            }
    
            resolve(undefined)
        })
    });
}

function extensionStatusChange(extStatus){
    if(extStatus){
        if(document.querySelector('.extension-header') && extStatus == true) return;
        
        const body = document.querySelector('body')
        const header = document.createElement('div')
        header.innerHTML = `
        <div class="logo">inclusio</div>
        <div class="selected-image" >No Image Selected</div>
        <div class="discardBtn">Discard Changes</div>
        <div class="vr"></div>
        <div class="saveBtn">Save Changes</div>
        `
        header.classList = "extension-header"

        loadCSS(css);
        body.insertBefore(header, body.firstChild)

        const images = document.querySelectorAll('img:not(.gallery-img)');

        chrome.storage.sync.set({})
        images.forEach(img => {
            const parent = img.parentNode
            const wrapper = document.createElement('div')
            wrapper.classList.add('img-wrapper-div')

            const wrapperControls = document.createElement('div');
            wrapperControls.classList.add('wrapper-controls')
            let imageStatusMessage = ''

            getImageAltTextFromStorage(img.src)
                .then(storageAltText => {

                    const altText = storageAltText ?? img.alt ?? '';
                    if (!altText.trim()) {
                        wrapper.classList.add('no-alt-text')
                        imageStatusMessage = 'No Description'
                    } else {
                        wrapper.classList.add('has-alt-text')
                        imageStatusMessage = 'Has Description';
                    }
                    parent.replaceChild(wrapper, img);
                    wrapper.appendChild(img);

                    wrapperControls.innerHTML = `
            <div class="img-alt-text-div">${imageStatusMessage}</div>`
            // <div class="edit-input hidden"><input size="${altText.length}" type="text" value="${altText}"></div>
            // <div class="edit-icon-div"> ${editIconSvg}</div>`
                    wrapper.appendChild(wrapperControls)

                    //FOR OPENING GALLERY
                    wrapper.addEventListener('click', (event) => {
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        
                        
                        toggleGallery(true, img)
                    })

                    setTimeout(() => {
                        const parentATag = wrapper.closest('a')
                        if (parentATag) parentATag.href = 'javascript:void(0)'

                        //EDIT with edit pen
                        // const imageAltTextDiv = wrapperControls.querySelector('.img-alt-text-div')

                        // wrapperControls.querySelector('.edit-icon-div').addEventListener('click', () => {

                        //     wrapperControls.querySelector('.edit-input').classList.toggle('hidden');
                        //     imageAltTextDiv.classList.toggle('hidden');
                        // })

                        // const input = wrapperControls.querySelector('.edit-input input')

                        // const debounceCb = debounce(() => {
                        //     changeImageAltTextInStorage(img.src, input.value);
                        //     imageAltTextDiv.innerText = input.value;
                        // }, 500);

                        // input.addEventListener('input', debounceCb)
                    }, 0)

                })


        })

        setAltTextOfImageArrayToStorage(Array.from(images));
    } else {
        const extHeader = document.querySelector('.extension-header');

        if(extHeader){
            window.location.reload();
        }
    }
}

function changeImageAltTextInStorage(imgSrc, newAltText){
    const pageUrl = trimQueryParamsFromUrl(window.location.href);

    chrome.storage.local.get('alt_text', function (result) {
        let altTextObject = result.alt_text;

        if (!altTextObject) altTextObject = {};

        let currentPageAltText = altTextObject[pageUrl];

        if (!currentPageAltText) {
            currentPageAltText = {};
        }

        currentPageAltText[imgSrc] = newAltText;

        altTextObject[pageUrl] = currentPageAltText;
        chrome.storage.local.set({'alt_text' : altTextObject})
    })
}

function filterDuplicateImagesBySrc(galleryImagesArray) {

    const srcs = galleryImagesArray.map(o=> o.src)
    const filtered = galleryImagesArray.filter(({ src }, index) => !srcs.includes(src, index + 1))
    return filtered;
}

function toggleGallery(show, selectedImage){
    let galleryDiv = document.querySelector('.galleryDiv');

    if(!galleryDiv){
        //gallery div not yet injected
        galleryDiv = document.createElement('div');
        galleryDiv.classList.add('galleryDiv')
        const body = document.querySelector('body')
        body.appendChild(galleryDiv)

        injectGalleryContent(galleryDiv);
        
        setTimeout(injectGalleryJavascript,0)

        galleryImagesArray = Array.from(document.querySelectorAll('img:not(.gallery-img)'));

        //remove images with same src (only one of them)
        galleryImagesArray = filterDuplicateImagesBySrc(galleryImagesArray);

        setTimeout(() => injectImagesIntoGallery(galleryImagesArray, selectedImage),0)

        // const allImages = document.querySelectorAll('img:not(.gallery-img)')
        // const allImagesSourcesAndAlts = Array.from(allImages).map(img => {
        //     return {src: img.src, alt: img.alt}
        // });

        // allImagesSourcesAndAlts.filter(obj =>{
        // })

        // setTimeout(injectImagesIntoGallery(allImagesSourcesAndAlts),1);
    }else{
        //gallery div already injected
        if (show) {
            galleryDiv.classList.remove('hidden')
            galleryImagesArray = Array.from(document.querySelectorAll('img:not(.gallery-img)'));

            //remove images with same src (only one of them)
            galleryImagesArray = filterDuplicateImagesBySrc(galleryImagesArray);

            setTimeout(() => injectImagesIntoGallery(galleryImagesArray, selectedImage), 0)
        } else {
            galleryDiv.classList.add('hidden')
        }
    }
}

function injectImagesIntoGallery(galleryImagesArray, selectedImage){
    selectedImgRef = selectedImage;
    const mainImg = document.querySelector('.galleryDiv .img-div.main img');
    const textArea = document.querySelector('.galleryDiv textarea')
    const indexOfSelectedImg = galleryImagesArray.findIndex(img => selectedImage.src == img.src);

    const selectedImageHeaderDiv = document.querySelector('.extension-header .selected-image');
    selectedImageHeaderDiv.innerHTML = `Image ${indexOfSelectedImg+1}`
    if(selectedImage.alt){
        selectedImageHeaderDiv.classList.add("has-alt-text")
    }else{
        selectedImageHeaderDiv.classList.add("no-alt-text")
    }

    textArea.value = selectedImage.alt;

    mainImg.src = selectedImage.src;

    //setup prev i next images
    const prevImg = document.querySelector('.galleryDiv .img-div.prev img');
    prevImg.src = galleryImagesArray[indexOfSelectedImg-1].src

    const nextImg = document.querySelector('.galleryDiv .img-div.next img');
    nextImg.src = galleryImagesArray[indexOfSelectedImg+1].src
}

function injectGalleryJavascript() {

    const closeBtn = document.querySelector('.galleryDiv .close-btn');
    closeBtn.addEventListener('click', () => {
        toggleGallery(false);
        const selectedImageHeaderDiv = document.querySelector('.extension-header .selected-image');
        selectedImageHeaderDiv.innerHTML = 'No Image Selected';
        selectedImageHeaderDiv.classList.remove('no-alt-text')
        selectedImageHeaderDiv.classList.remove('has-alt-text')
    })

    const prevBtn = document.querySelector('.galleryDiv .prev-img-svg-div');

    prevBtn.addEventListener('click', () =>{
        const allImages = Array.from(document.querySelectorAll('img:not(.gallery-img)'));
        
        const selectedImageIndex = allImages.findIndex(img => selectedImgRef.src == img.src)

        if(selectedImageIndex == 0) return;

        //selected img is prev img
        selectedImgRef = allImages[selectedImageIndex - 1];
        const mainImg = document.querySelector('.img-div.main img');
        mainImg.src = selectedImgRef.src;

        //setup textarea
        const textarea = document.querySelector('.galleryDiv textarea');
        textarea.value = selectedImgRef.alt;

        //prev img is prev-prev img
        const prevImg = document.querySelector('.img-div.prev img');
        prevImg.src = allImages[selectedImageIndex-2].src;

        //next img is selected img
        const nextImg = document.querySelector('.img-div.next img');
        nextImg.src = allImages[selectedImageIndex].src;
    });

    const nextBtn = document.querySelector('.galleryDiv .next-img-svg-div');

    nextBtn.addEventListener('click', () =>{
        const allImages = Array.from(document.querySelectorAll('img:not(.gallery-img)'));
        
        const selectedImageIndex = allImages.findIndex(img => selectedImgRef.src == img.src)

        if(selectedImageIndex == 0) return;

        //selected img is prev img
        selectedImgRef = allImages[selectedImageIndex + 1];
        const mainImg = document.querySelector('.img-div.main img');
        mainImg.src = selectedImgRef.src;

        //setup textarea
        const textarea = document.querySelector('.galleryDiv textarea');
        textarea.value = selectedImgRef.alt;

        //prev img is prev-prev img
        const prevImg = document.querySelector('.img-div.prev img');
        prevImg.src = allImages[selectedImageIndex].src;

        //next img is selected img
        const nextImg = document.querySelector('.img-div.next img');
        nextImg.src = allImages[selectedImageIndex+2].src;
    });
}


// function selectImage(imageContainer, index) {
//     const selectedImage = imageContainer.querySelector('img');
//     const selectedImageSource = selectedImage.src;
//     imageContainer.setAttribute('selected', 'true')
//     selectedImage.src = selectedImageSource;
//     imageTextArea.value = selectedImage.alt
//     imageNumberSpan.innerHTML = index;
// }

function injectGalleryContent(galleryDiv){
    galleryDiv.innerHTML = `<div class="carousel">
    <div class="img-div prev"><img class="gallery-img" src="https://picsum.photos/500/500" alt=""></div>
    <div class="prev-img-svg-div">
        ${prevImgSvg}
    </div>

    <div class="img-div main"><img class="gallery-img" src="https://picsum.photos/500/500" alt=""></div>

    <div class="next-img-svg-div">
        ${prevImgSvg}
    </div>
    <div class="img-div next"><img class="gallery-img" src="https://picsum.photos/500/500" alt=""></div>
</div>
<div class="text-area-div">
    <div>
        <textarea name="" id="" cols="30" rows="10"></textarea>
    </div>
</div>
<div class="close-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>

</div>
    `
}

