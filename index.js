let imgs,
	photoID,
	photoTitle,
	exif,
	exifCamera,
	exifExposure,
	exifAperture,
	exifISO,
	exifFocalLength,
	largeImg,
	exifPopup;
let listDone = false;
let pageNum = 1;
let perPage = 24;
let nextButton = document.querySelector('.btn-next');
let prevButton = document.querySelector('.btn-previous');
let pageSelect = document.getElementById('page-select');

pageSet();
next();
previous();
