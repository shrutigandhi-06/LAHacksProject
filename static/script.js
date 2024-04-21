// Get modal element
var modal = document.getElementById('cameraModal');
var btn = document.getElementById('openCamera');
var span = document.getElementsByClassName('close')[0];
var recyclableElement = document.querySelector('.recyclable');
var compostElement = document.querySelector('.compost');
var trashElement = document.querySelector('.trash');
var way0 =  document.querySelector('.upcycle-way-1');
var way1 = document.querySelector('.upcycle-way-2');
var way2 = document.querySelector('.upcycle-way-3');
var upcycling_list = document.querySelector('#upcycling-list')
var item_name = document.querySelector(".item-name")

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
    startCamera();
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
    stopCamera();
}

// Close the modal if user clicks outside of it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        stopCamera();
    }
}

function startCamera() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error("Error accessing the camera.", error);
        });
}

function stopCamera() {
    const video = document.getElementById('video');
    video.srcObject.getTracks().forEach(track => track.stop());
}

document.getElementById('capture').addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // sendImg(canvas.toDataURL('image/png'));

    const dataURL = canvas.toDataURL('image/png');

    // Convert data URL to Blob
    dataURLtoBlob(dataURL).then(blob => {
        // Create a File from Blob
        const file = new File([blob], "capture.png", { type: 'image/png' });

        // Call the sendImg function with the File object
        sendImg(file);
    });

    modal.style.display = "none";
    stopCamera();
});

function dataURLtoBlob(dataURL) {
    return fetch(dataURL)
        .then(res => res.blob());
}

function sendImg(file) {
    console.log(file)
    var formData = new FormData();
    formData.append('file', file);

    $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {

            let jsonObject = JSON.parse(response.substring(8, response.length - 3));
            console.log(jsonObject);
            // console.log(jsonObject.item);
            // console.log(jsonObject["recycling bin color"]);
            // console.log(jsonObject["upcycling ideas"]);

            binColor = jsonObject["recycling bin color"];
            upcycle =  jsonObject["upcycling ideas"]

            if(typeof binColor === 'undefined'){
                binColor = jsonObject["recycling_bin_color"]
            }

            if(typeof upcycle === 'undefined'){
                upcycle = jsonObject["upcycling_ideas"]
            }

            way0.textContent = upcycle[0]
            way1.textContent = upcycle[1]
            way2.textContent = upcycle[2]

            upcycling_list.style.display = 'flex';
            item_name.textContent = jsonObject.item
            compostElement.classList.add('animate__pulse');

            if (binColor === "Blue" || binColor === "blue") {

                ////in case of blue
                compostElement.classList.add('animate__zoomOutRight');
                trashElement.classList.add('animate__zoomOutRight');
                compostElement.addEventListener('animationend', function () {
                    // Set display to none after animation is finished
                    compostElement.style.display = 'none';
                });

                trashElement.addEventListener('animationend', function () {
                    // Set display to none after animation is finished
                    trashElement.style.display = 'none';
                });
            }
            else if (binColor === "Green" || binColor === "green") {

                ///in case of green
                recyclableElement.classList.add('animate__zoomOutLeft');
                trashElement.classList.add('animate__zoomOutRight');
                recyclableElement.addEventListener('animationend', function () {
                    // Set display to none after animation is finished
                    recyclableElement.style.display = 'none';
                });

                trashElement.addEventListener('animationend', function () {
                    // Set display to none after animation is finished
                    trashElement.style.display = 'none';
                });
            }
            else {
                ///in case of yellow
                recyclableElement.classList.add('animate__zoomOutLeft');
                compostElement.classList.add('animate__zoomOutLeft');
                compostElement.addEventListener('animationend', function () {
                    // Set display to none after animation is finished
                    compostElement.style.display = 'none';
                });

                recyclableElement.addEventListener('animationend', function () {
                    // Set display to none after animation is finished
                    recyclableElement.style.display = 'none';
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error uploading image:', error);
        }
    });
}