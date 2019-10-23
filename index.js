let imgs, photoID, photoTitle, exif, exifCamera, exifExposure, exifAperture, exifISO, exifFocalLength, largeImg;
let gallery = document.getElementById('gallery');
let largeImgDiv = document.getElementById('large-img');

renderGallery();
setImgIDs();
