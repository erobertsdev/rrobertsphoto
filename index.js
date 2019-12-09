let pageNum = 1;
let listDone = false;
let imgs;
const gallery = document.getElementById('gallery');
const pageSelect = document.getElementById('page-select');
const nextButton = document.querySelector('.btn-next');
const prevButton = document.querySelector('.btn-previous');

pageSelect.addEventListener('change', (e) => {
	pageNum = e.target.value;
	renderGallery(pageNum);
});

const fetchData = async (perPage, pageNum) => {
	const response = await axios.get('https://www.flickr.com/services/rest/', {
		params: {
			method: 'flickr.people.getPublicPhotos',
			api_key: '4dbd96ac5faaa6d7c4745f718f6e0b9d',
			user_id: '46881493@N04',
			extras: 'url_m',
			per_page: perPage,
			page: pageNum,
			format: 'json',
			nojsoncallback: 1
		}
	});
	return response.data;
};

const renderGallery = async (pageNum) => {
	gallery.innerHTML = '';
	const imgData = await fetchData(24, pageNum);
	const imgList = imgData.photos.photo;
	const pages = imgData.photos.pages;

	for (let img of imgList) {
		const imgContainer = document.createElement('div');
		imgContainer.classList.add('img-container');
		imgContainer.innerHTML = `
			<div class="title">${img.title}</div>
			<img id="${img.id}" src="${img.url_m}" class="image">
			<div class="exif-popup" id="exif-popup${img.id}"></div>
			<div class="sub-button exif" onclick="displayExif()">EXIF</div>
			<div class="sub-button full-size" onclick="fullSize(${img.id})">FULLSIZE</div>
	`;
		gallery.appendChild(imgContainer);
	}
	if (!listDone) {
		for (let i = 1; i < pages; i++) {
			pageSelect.options[pageSelect.options.length] = new Option(i, i);
		}
		listDone = true;
	}

	imgs = document.querySelectorAll('.image');
	setExif();
	hideNext();
	hidePrevious();
};

renderGallery(pageNum);

nextButton.addEventListener('click', function() {
	if (pageNum < pageSelect.length) {
		pageNum++;
		renderGallery(pageNum);
		window.scrollTo(0, 0);
		pageSelect.value = pageNum;
	}
});

const hideNext = () =>
	pageNum === String(pageSelect.options.length)
		? (nextButton.style.display = 'none')
		: (nextButton.style.display = 'inherit');

prevButton.addEventListener('click', function() {
	if (pageNum > 1) {
		pageNum--;
		renderGallery(pageNum);
		window.scrollTo(0, 0);
		pageSelect.value = pageNum;
	}
});

const hidePrevious = () =>
	pageNum === 1 ? (prevButton.style.display = 'none') : (prevButton.style.display = 'inherit');

const fetchExif = async (id) => {
	const response = await axios.get('https://www.flickr.com/services/rest/', {
		params: {
			method: 'flickr.photos.getExif',
			api_key: '4dbd96ac5faaa6d7c4745f718f6e0b9d',
			photo_id: id,
			format: 'json',
			nojsoncallback: 1
		}
	});
	return response.data.photo;
};

const setExif = () => {
	for (let img of imgs) {
		img.addEventListener('mouseover', async () => {
			const exifData = await fetchExif(img.id);
			exifPopup = document.getElementById(`exif-popup${img.id}`);
			let camera = exifData.camera;
			let exifExposure, exifAperture, exifISO, exifFocalLength;
			for (let i = 0; i < exifData.exif.length; i++) {
				if (exifData.exif[i].tag === 'ExposureTime') {
					exifExposure = exifData.exif[i].raw._content;
				} else if (exifData.exif[i].label === 'Aperture') {
					exifAperture = exifData.exif[i].clean._content;
				} else if (exifData.exif[i].tag === 'ISO') {
					exifISO = exifData.exif[i].raw._content;
				} else if (exifData.exif[i].tag === 'FocalLength') {
					exifFocalLength = exifData.exif[i].raw._content;
				}
			}

			exifPopup.innerHTML = `<p>Camera: ${camera}</p>
			<p>Exposure Time: ${exifExposure}</p>
			<p>Aperture: ${exifAperture}</p>
			<p>ISO: ${exifISO}</p>
			<p>Focal Length: ${exifFocalLength}</p>`;
		});
	}
};

const displayExif = () => {
	exifPopup.classList.toggle('popup');
};

const fullSize = async (id) => {
	const response = await axios.get('https://www.flickr.com/services/rest/', {
		params: {
			method: 'flickr.photos.getSizes',
			api_key: '4dbd96ac5faaa6d7c4745f718f6e0b9d',
			photo_id: id,
			format: 'json',
			nojsoncallback: 1
		}
	});
	let sizes = response.data.sizes.size;
	for (let size of sizes) {
		if (size.label === 'Original') {
			window.location.href = size.source;
		}
	}
};
