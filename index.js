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
let listDone = false; // hacky way to stop page list from regenerating every time new page is selected
let pageNum = 1;
let perPage = 24;
let gallery = document.getElementById('gallery');
// let largeImgDiv = document.getElementById('large-img');
let nextButton = document.querySelector('.btn-next');
let prevButton = document.querySelector('.btn-previous');
let pageSelect = document.getElementById('page-select');

pageStart();
