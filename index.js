let imgs, photoID, photoTitle, exif, exifCamera, exifExposure, exifAperture, exifISO, exifFocalLength, largeImg;
let pageNum = 1;
let perPage = 24;
let gallery = document.getElementById('gallery');
let largeImgDiv = document.getElementById('large-img');
let nextButton = document.querySelector('.btn-next');
let prevButton = document.querySelector('.btn-previous');
// let displayPageNumber = document.querySelector('.page-number');
let pageSelect = document.getElementById('page-select');

renderGallery(pageNum, perPage);
setImgIDs();
pageSet();
next();
previous();
