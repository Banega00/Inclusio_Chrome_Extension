const selectedImage = document.getElementById('selectedImage');
const imageNumberSpan = document.getElementById('image-number')
const totalNumberSpan = document.getElementById('total-number')
const saveAltTextBtn = document.getElementById('saveAltText-btn')
const imageTextArea = document.getElementById('image-alt-textarea')

const allImages = document.querySelectorAll('.image-container')
allImages.forEach((imageContainer, index) =>{
    imageContainer.addEventListener('click', event =>{
        document.querySelector('.image-container[selected="true"]').removeAttribute('selected')
        selectImage(event.currentTarget, index + 1);
    })
})

selectedImage.src = document.querySelector('.image-container[selected="true"] img').src
totalNumberSpan.innerHTML = allImages.length;

function selectImage(imageContainer, index){
    const selectedImage = imageContainer.querySelector('img');
    const selectedImageSource = selectedImage.src;
    imageContainer.setAttribute('selected','true')
    selectedImage.src = selectedImageSource;
    imageTextArea.value = selectedImage.alt
    imageNumberSpan.innerHTML = index;
}


saveAltTextBtn.addEventListener('click', target => {
    console.log("Saving alt text for image", imageTextArea.value) 
})