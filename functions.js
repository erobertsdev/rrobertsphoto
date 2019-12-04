function renderGallery(page, perPage) {
	let gallery = document.getElementById('gallery');
	fetch(
		`https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=4dbd96ac5faaa6d7c4745f718f6e0b9d&user_id=46881493%40N04&extras=url_m&per_page=${perPage}&page=${page}&format=json&nojsoncallback=1`
	)
		.then((response) => {
			response.json().then(function(data) {
				let galleryList = '';
				for (let i = 0; i < data.photos.perpage; i++) {
					let photoID = data.photos.photo[i].id;
					let photoURL = data.photos.photo[i].url_m;
					photoTitle = data.photos.photo[i].title;
					galleryList += `<div class="img-container">
					<div class="title">${photoTitle}</div>
					<img id="${photoID}" src="${photoURL}" class="image">
					<div class="exif-popup" id="exif-popup${photoID}"></div>
					<div class="sub-button exif" onclick="displayExif()">EXIF</div>
					<div class="sub-button full-size" onclick="fullSize()">FULLSIZE</div>
					</div>`;
				}
				if (!listDone) {
					for (let i = 1; i < data.photos.pages; i++) {
						pageSelect.options[pageSelect.options.length] = new Option(i, i);
					}
					listDone = true;
				}
				gallery.innerHTML = `${galleryList}`;
				exif = document.querySelectorAll('.exif');
				imgs = document.querySelectorAll('img');
				hideNext();
				hidePrevious();
			});
		})
		.catch((err) => {
			alert('Error retrieving photos, please try refreshing the page.', err);
		});
}

// Gathers EXIF data and photoID for EXIF and FULLSIZE buttons when picture is mousedover
function setImgIDs() {
	setTimeout(() => {
		for (let img of imgs) {
			img.onmouseover = function() {
				// Prevents error if logo is hovered over (doesn't try to collect data on it)
				if (this.classList[0] !== 'main-logo') {
					for (let img of imgs) {
						if (img.id !== this.id) {
							img.classList.add('blur');
						}
					}
					photoID = this.id;
					exifPopup = document.getElementById(`exif-popup${photoID}`);
					getExif();
				}
			};
			img.onmouseout = function() {
				for (let img of imgs) {
					img.classList.remove('blur');
				}
			};
		}
	}, 2000);
}

function getExif() {
	fetch(
		`https://www.flickr.com/services/rest/?method=flickr.photos.getExif&api_key=fa85dd29b93573b004328880fb639803&photo_id=${photoID}&format=json&nojsoncallback=1`
	)
		.then(function(response) {
			response.json().then((data) => {
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
		.catch(() => alert('Error retrieving data. Please try again in a moment.'));
}

function displayExif() {
	exifPopup.classList.toggle('popup');
	exifPopup.innerHTML = `<p>Camera: ${exifCamera}</p>
						<p>Exposure Time: ${exifExposure}</p>
						<p>Aperture: ${exifAperture}</p>
						<p>ISO: ${exifISO}</p>
						<p>Focal Length: ${exifFocalLength}</p>`;
}

function fullSize() {
	fetch(
		`https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=fa85dd29b93573b004328880fb639803&photo_id=${photoID}&format=json&nojsoncallback=1`
	)
		.then((response) => {
			response.json().then((data) => {
				for (let i = 0; i < data.sizes.size.length; i++) {
					if (data.sizes.size[i].label === 'Original') {
						largeImg = data.sizes.size[i].source;
					}
				}
				window.location.href = `${largeImg}`;
			});
		})
		.catch(() => alert('An error occurred, please try again in a moment.'));
}

function pageSet() {
	pageSelect.addEventListener('change', () => {
		pageNum = pageSelect.selectedIndex + 1;
		pageStart();
	});
	pageStart();
}

function next() {
	nextButton.addEventListener('click', function() {
		if (pageNum < pageSelect.length) {
			pageNum = pageNum + 1;
			pageStart();
			window.scrollTo(0, 0);
			pageSelect.value = pageNum;
		}
	});
}

const hideNext = () =>
	pageNum === pageSelect.options.length
		? (nextButton.style.display = 'none')
		: (nextButton.style.display = 'inherit');

function previous() {
	prevButton.addEventListener('click', function() {
		if (pageNum > 1) {
			pageNum = pageNum - 1;
			pageStart();
			window.scrollTo(0, 0);
			pageSelect.value = pageNum;
		}
	});
}

const hidePrevious = () =>
	pageNum === 1 ? (prevButton.style.display = 'none') : (prevButton.style.display = 'inherit');

const pageStart = () => {
	renderGallery(pageNum, perPage);
	setImgIDs();
};
