let imgs, photoID, photoTitle, exif, exifCamera, exifExposure, exifAperture, exifISO, exifFocalLength, largeImg;
let pageNum = 1;
let perPage = 25;
let gallery = document.getElementById('gallery');
let largeImgDiv = document.getElementById('large-img');

renderGallery(pageNum, perPage);
setImgIDs();
