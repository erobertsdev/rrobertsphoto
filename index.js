let imgs, photoID, exifCamera, exifExposure, exifAperture, exifISO, exifFocalLength;
let gallery = document.getElementById('gallery');
let exifData = document.querySelectorAll('.exif-data'); // doesn't work right now

renderGallery();
setImgIDs();
