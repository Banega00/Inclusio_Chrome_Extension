const editIconSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512">
<g>
  <g>
    <path d="m179.2,410.4l-77.3-77.4 272.5-272.9 77.3,77.4-272.5,272.9zm-96-38.3l56.9,57-79.2,22.3 22.3-79.3zm411.8-249l-106.2-106.4c-7.7-7.7-21.2-7.7-28.9-3.55271e-15l-301.3,301.8c-2.5,2.5-4.3,5.5-5.2,8.9l-41.6,148c-2,7.1 0,14.8 5.2,20 3.9,3.9 11.7,6.7 20,5.2l147.8-41.7c3.4-0.9 6.4-2.7 8.9-5.2l301.3-301.7c8-8 8-20.9 0-28.9z"/>
  </g>
</g>
</svg>`

const css = `
*{
    box-sizing: border-box;
}

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
    border: 5px solid black;
}

.img-wrapper-div .wrapper-controls{
    display: flex;
    align-items: flex-end;
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

.neutral{
    border-color: orange;
    background-color: orange;
}

.no-alt-text{
    border-color: red;
    background-color: red;
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
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.75);
    padding-top: 120px;
    overflow: auto;
}

.galleryDiv.hidden{
    display:none;
}

a.disabled {
    pointer-events: none;
    cursor: default;
  }


.galleryDiv .carousel-main-container{
    min-width: 500px;
    min-height: 500px;
    margin: auto;
    display: flex;
    
}

.galleryDiv .carousel-main-container .main-div{
    display: flex;
    flex-direction: column;
    margin-right: 10px;
}

.galleryDiv .carousel-main-container .main-div .controls-div{
    padding:10px;
}

.galleryDiv .carousel-main-container .other-images-cotainer{
    display: flex;
    flex-wrap: wrap;
}

.galleryDiv .carousel-main-container .image-div{
    width: 500px;
    height: 500px;
    margin-bottom: 10px;
}

.galleryDiv .carousel-main-container .image-div img{
    width: 100%;
    height: 100%;
}

.galleryDiv .carousel-main-container .other-images-cotainer > div{
    margin-right: 10px;
    margin-bottom: 10px;
}

.galleryDiv .bg-div{
    margin: auto;
    background-color: rgba(0,0,0,0.65);
    height: 100vh;
    width: 100vw;
    padding: 50px;
}

.galleryDiv .image-container[selected="true"]{
    border: 5px solid blue;
}

.galleryDiv .image-container{
    cursor: pointer;
    width: 100px;
    height: 100px;

}

.galleryDiv .image-container img{
    width: 100%;
    height: 100%;
}

.galleryDiv .image-counting-div{
    color:white;
    font-size: 1.2em;
}

.galleryDiv .control-btns{
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
}

.galleryDiv .control-btns button{
    font-size: 1.5em;
    font-weight: bold;
    width: 20%;
}
`

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch(request.message){
            case 'extension_status':
                extensionStatusChange(request.status)
            break;
        }
    }
)

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

    chrome.storage.sync.get('alt_text', function (result) {
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
        console.log(altTextObject)
        chrome.storage.local.set({'alt_text' : altTextObject})
    })
}

function extensionStatusChange(extStatus){
    if(extStatus){

        const body = document.querySelector('body')
        const header = document.createElement('div')
        header.innerHTML = '<div>Pozdrav brate</div>'
        header.classList = "extension-header"

        loadCSS(css);
        body.appendChild(header)

        const images = document.querySelectorAll('img');

        chrome.storage.sync.set({})
        images.forEach(img=>{
            const parent = img.parentNode
            const wrapper = document.createElement('div')
            wrapper.classList.add('img-wrapper-div')

            const wrapperControls = document.createElement('div');
            wrapperControls.classList.add('wrapper-controls')
            let imageStatusMessage = ''
            const altText = img.alt ?? '';
            if(!altText.trim()){
                wrapper.classList.add('no-alt-text')
                imageStatusMessage = 'Alt text missing'
            }else{
                wrapper.classList.add('neutral')
                imageStatusMessage =  altText;
            }
            parent.replaceChild(wrapper, img);
            wrapper.appendChild(img);

            wrapperControls.innerHTML = `
            <div class="img-alt-text-div">${imageStatusMessage}</div>
            <div class="edit-input hidden"><input size="${img.alt.length}" type="text" value="${img.alt}"></div>
            <div class="edit-icon-div"> ${editIconSvg}</div>`
            wrapper.appendChild(wrapperControls)

            //FOR OPENING GALLERY
            wrapper.addEventListener('click', (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                // toggleGalery(true)
            })

            setTimeout(()=>{
                const parentATag = wrapper.closest('a')
                if(parentATag) parentATag.href = 'javascript:void(0)'

                wrapperControls.querySelector('.edit-icon-div').addEventListener('click', ()=>{
                    
                    wrapperControls.querySelector('.edit-input').classList.toggle('hidden');
                    wrapperControls.querySelector('.img-alt-text-div').classList.toggle('hidden')
                })
            },0)
        })

        setAltTextOfImageArrayToStorage(Array.from(images));
    }else{
        window.location.reload();
    }
}

function countOccurrencesOfImgSrc(array, ){ return arr.reduce((a, v) => (v === val ? a + 1 : a), 0)}

function toggleGalery(show){
    let galleryDiv = document.querySelector('.galleryDiv');

    if(!galleryDiv){
        //gallery div not yet injected
        galleryDiv = document.createElement('div');
        galleryDiv.classList.add('galleryDiv')
        const body = document.querySelector('body')
        body.appendChild(galleryDiv)

        injectGalleryContent(galleryDiv);
        
        setTimeout(injectGalleryJavascript,0)

        const allImages = document.querySelectorAll('img')
        const allImagesSourcesAndAlts = Array.from(allImages).map(img => {
            return {src: img.src, alt: img.alt}
        });

        allImagesSourcesAndAlts.filter(obj =>{
        })

        setTimeout(injectImagesIntoGallery(allImagesSourcesAndAlts),1);
    }else{
        //gallery div already injected
        if(show){
            galleryDiv.classList.remove('hidden')
        }else{
            galleryDiv.classList.add('hidden')
        }
    }
}

function injectImagesIntoGallery(imageSourceAndAltArray){
    const imagesContainer = document.querySelector('.other-images-cotainer');
    imageSourceAndAltArray.forEach(({src, alt}, index) => {
        const imageContainer = document.createElement('div')
        imageContainer.classList.add('image-container');

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;

        imageContainer.appendChild(img);

        imagesContainer.appendChild(imageContainer);

        imageContainer.addEventListener('click', event => {
            document.querySelector('.image-container[selected="true"]').removeAttribute('selected')
            selectImage(event.currentTarget, index + 1);
        })
    })
}

function injectGalleryJavascript() {
    const selectedImage = document.getElementById('selectedImage');
    const imageNumberSpan = document.getElementById('image-number')
    const totalNumberSpan = document.getElementById('total-number')
    const saveAltTextBtn = document.getElementById('saveAltText-btn')
    const closeGalleryBtn = document.getElementById('closeGallery-btn')
    const otherImagesContainer = document.querySelector('.other-images-cotainer')
    const nextImgBtn = document.getElementById('nextImg-btn')
    const previousImgBtn = document.getElementById('previousImg-btn')
    const imageTextArea = document.getElementById('image-alt-textarea')

    // const allImages = document.querySelectorAll('.image-container')
    // allImages.forEach((imageContainer, index) => {
    //     imageContainer.addEventListener('click', event => {
    //         document.querySelector('.image-container[selected="true"]').removeAttribute('selected')
    //         selectImage(event.currentTarget, index + 1);
    //     })
    // })

    closeGalleryBtn.addEventListener('click', () => toggleGalery(false))

    selectedImage.src = document.querySelector('.image-container[selected="true"] img').src
    totalNumberSpan.innerHTML = allImages.length;

    


    saveAltTextBtn.addEventListener('click', target => {
        console.log("Saving alt text for image", imageTextArea.value)
    })
}

function selectImage(imageContainer, index) {
    const selectedImage = imageContainer.querySelector('img');
    const selectedImageSource = selectedImage.src;
    imageContainer.setAttribute('selected', 'true')
    selectedImage.src = selectedImageSource;
    imageTextArea.value = selectedImage.alt
    imageNumberSpan.innerHTML = index;
}

function injectGalleryContent(galleryDiv){
    galleryDiv.innerHTML = `<main class="carousel-main-container">
    <div class="main-div">
        <div class="image-div">
            <img id="selectedImage" src="https://picsum.photos/500/500" alt="">
        </div>
        <div class="controls-div">
            <div class="image-counting-div">Image <span id="image-number">1</span>/<span id="total-number"></span></div>
            <textarea name="" id="image-alt-textarea" cols="30" rows="4"></textarea>
            <div class="control-btns">
                <button type="button" id="saveAltText-btn" class="btn btn-primary">Save</button>
                <button type="button" id="closeGallery-btn" class="btn btn-primary">Close</button>
                <button type="button" id="nextImg-btn" class="btn btn-primary"><</button>
                <button type="button" id="previousImg-btn" class="btn btn-primary">></button>
            </div>
        </div>
    </div>
    <div class="other-images-cotainer">
    </div>
</main>
    `
}