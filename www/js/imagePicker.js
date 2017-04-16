var pictureSource;
var destinationType;
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
};
function onPhotoURISuccess(imageURI) {
    var fishphoto = document.getElementById('fishPhoto');
    var picUrl = document.getElementById('picUrl');
    //console.log(imageURI);
    fishphoto.src = imageURI;
    picUrl.value = imageURI;
};
function getPhoto(source) {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
};

function onFail(message) {
    console.log('Failed because: ' + message);
};