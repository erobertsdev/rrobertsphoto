let imgs, photoID, photoTitle, exif, exifCamera, exifExposure, exifAperture, exifISO, exifFocalLength, largeImg;
let pageNum = 1;
let perPage = 24;
let gallery = document.getElementById('gallery');
let largeImgDiv = document.getElementById('large-img');
let nextButton = document.querySelector('.btn-next');
let prevButton = document.querySelector('.btn-previous');

renderGallery(pageNum, perPage);
setImgIDs();
next();
previous();
