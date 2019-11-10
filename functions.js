function renderGallery(page, perPage) {
	fetch(
		`https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=4dbd96ac5faaa6d7c4745f718f6e0b9d&user_id=46881493%40N04&extras=url_m&per_page=${perPage}&page=${page}&format=json&nojsoncallback=1`
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
					photoTitle = data.photos.photo[i].title;
					galleryList += `<div class="img-container"><div class="title">${photoTitle}</div><img id="${photoID}" src="${photoURL}" class="image"><div class="sub-button exif" onclick="displayExif()">EXIF</div><div class="sub-button full-size" onclick="fullSize()">FULLSIZE</div></div>`;
				}
				for (let i = 1; i <= data.photos.pages; i++) {
					pageSelect.options[pageSelect.options.length] = new Option(i, i);
				}
				gallery.innerHTML = `${galleryList}`;
				// displayPageNumber.innerHTML = `Page: ${pageNum}`;
				exif = document.querySelectorAll('.exif');
				imgs = document.querySelectorAll('img');
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
			img.onmouseover = function() {
				photoID = this.id;
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
				for (let i = 0; i < data.photo.exif.length; i++) {
					if (data.photo.exif[i].tag === 'ExposureTime') {
						exifExposure = data.photo.exif[i].raw._content;
					} else if (data.photo.exif[i].label === 'Aperture') {
						exifAperture = data.photo.exif[i].clean._content;
					} else if (data.photo.exif[i].tag === 'ISO') {
						exifISO = data.photo.exif[i].raw._content;
					} else if (data.photo.exif[i].tag === 'FocalLength') {
						exifFocalLength = data.photo.exif[i].raw._content;
					}
				}
			});
		})
		.catch(function(err) {
			console.log('Error retrieving data.', err);
		});
}

function displayExif() {
	console.log(exifCamera);
	console.log(exifExposure);
	console.log(exifAperture);
	console.log(exifISO);
	console.log(exifFocalLength);
}

// function click(node) {
// 	if (node === exif) {
// 		for (let i = 0; i < node.length; i++) {
// 			node[i].addEventListener('click', function(e) {});
// 		}
// 	}
// }

function fullSize() {
	fetch(
		`https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=fa85dd29b93573b004328880fb639803&photo_id=${photoID}&format=json&nojsoncallback=1`
	)
		.then(function(response) {
			response.json().then(function(data) {
				for (let i = 0; i < data.sizes.size.length; i++) {
					if (data.sizes.size[i].label === 'Original') {
						largeImg = data.sizes.size[i].source;
					}
				}
				window.location.href = `${largeImg}`;
			});
		})
		.catch(function(err) {
			console.log('Error retrieving data.', err);
		});
}

function pageSet() {
	pageSelect.addEventListener('change', function(e) {
		pageNum = e.target.value;
		renderGallery(pageNum, perPage);
	});
}

function next() {
	nextButton.addEventListener('click', function() {
		pageNum++;
		renderGallery(pageNum, perPage);
		window.scrollTo(0, 0);
	});
}

function previous() {
	prevButton.addEventListener('click', function() {
		if (pageNum >= 1) {
			pageNum--;
			renderGallery(pageNum, perPage);
			window.scrollTo(0, 0);
		}
	});
}

// https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=fa85dd29b93573b004328880fb639803&photo_id=${photoID}&format=json&nojsoncallback=1
