let imgs, photoID, exifCamera, exifExposure, exifAperture, exifISO, exifFocalLength;
let gallery = document.getElementById('gallery');

renderGallery();
setImgIDs();

function renderGallery() {
	fetch(
		'https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=4dbd96ac5faaa6d7c4745f718f6e0b9d&user_id=46881493%40N04&extras=url_m&format=json&nojsoncallback=1'
	)
		.then(function(response) {
			if (response.status !== 200) {
				console.log('Looks like there was a problem. Status Code: ' + response.status);
				return;
			}

			// Render photos to gallery div and assign IDs to use later for full-size and EXIF data
			response.json().then(function(data) {
				let galleryList = '';
				for (let i = 0; i < data.photos.perpage; i++) {
					let photoID = data.photos.photo[i].id;
					let photoURL = data.photos.photo[i].url_m;
					galleryList += `<img id="${photoID}" src="${photoURL}">`;
				}
				gallery.innerHTML = `${galleryList}`;
			});
		})
		.catch(function(err) {
			console.log('Error retrieving photos :(', err);
		});
}

// Assigns onclick event to individual images using their id after fetch builds list
// Will use later to gather EXIF data and hopefully display full-size image
function setImgIDs() {
	setInterval(() => {
		imgs = document.querySelectorAll('img');
		for (let i = 0; i < imgs.length; i++) {
			let img = imgs[i];
			img.onclick = function() {
				photoID = this.id;
				console.log(photoID);
				getExif();
			};
		}
	}, 2000);
}

// Gathers EXIF data when photo is clicked
function getExif() {
	fetch(
		`https://www.flickr.com/services/rest/?method=flickr.photos.getExif&api_key=fa85dd29b93573b004328880fb639803&photo_id=${photoID}&format=json&nojsoncallback=1`
	)
		.then(function(response) {
			response.json().then(function(data) {
				exifCamera = data.photo.camera;
				console.log(exifCamera);
				for (let i = 0; i < data.photo.exif.length; i++) {
					if (data.photo.exif[i].tag === 'ExposureTime') {
						exifExposure = data.photo.exif[i].raw._content;
						console.log(exifExposure);
					} else if (data.photo.exif[i].label === 'Aperture') {
						exifAperture = data.photo.exif[i].clean._content;
						console.log(exifAperture);
					} else if (data.photo.exif[i].tag === 'ISO') {
						exifISO = data.photo.exif[i].raw._content;
						console.log(exifISO);
					} else if (data.photo.exif[i].tag === 'FocalLength') {
						exifFocalLength = data.photo.exif[i].raw._content;
						console.log(exifFocalLength);
					}
				}
			});
		})
		.catch(function(err) {
			console.log('Error retrieving data.', err);
		});
}
