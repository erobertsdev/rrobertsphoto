const controller = (() => {
	return {
		listAdd: false,
		async fetchData(perPage = 24, pageNum = 1, searchText = '') {
			const response = await axios.get('https://www.flickr.com/services/rest/', {
				params: {
					method: 'flickr.photos.search',
					api_key: '4dbd96ac5faaa6d7c4745f718f6e0b9d',
					user_id: '46881493@N04',
					text: searchText,
					extras: 'url_m',
					per_page: perPage,
					page: pageNum,
					format: 'json',
					nojsoncallback: 1
				}
			});
			return response.data;
		},
		async renderGallery(pageNum) {
			let searchText = document.getElementById('search').value;
			const gallery = document.getElementById('gallery');
			document.querySelector('.page').classList.remove('hidden');
			gallery.innerHTML = '';
			const imgData = await this.fetchData(24, pageNum, searchText);

			if (imgData.photos.pages === 0) {
				document.querySelector('.page').classList.add('hidden');
				this.hideNext(0);
				this.hidePrevious(0);
				gallery.innerHTML = '<p class="no-results">NO RESULTS FOUND</p>';
				return;
			}

			const imgList = imgData.photos.photo;
			const pages = imgData.photos.pages;
			if (pages === 1) {
				document.querySelector('.page').classList.add('hidden');
			}

			for (let img of imgList) {
				const imgContainer = document.createElement('div');
				imgContainer.classList.add('img-container');
				imgContainer.innerHTML = `
				<div class="title">${img.title}</div>
				<img id="${img.id}" src="${img.url_m}" class="image">
				<div class="exif-popup" id="exif-popup${img.id}"></div>
				<div class="sub-button exif" onclick="controller.displayExif(${img.id})">EXIF</div>
				<div class="sub-button full-size" onclick="controller.fullSize(${img.id})">FULLSIZE</div>
		`;
				gallery.appendChild(imgContainer);
			}
			const pageSelect = document.getElementById('page-select');
			if (!this.listAdd) {
				for (let i = 1; i <= pages; i++) {
					pageSelect.options[pageSelect.options.length] = new Option(i, i);
				}
				this.listAdd = true;
			}

			imgs = document.querySelectorAll('.image');
			this.setExif();
			this.hideNext(pageNum);
			this.hidePrevious(pageNum);
		},
		async fullSize(id) {
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
					window.open(size.source, '_blank');
				}
			}
		},
		displayExif(id) {
			document.getElementById(`exif-popup${id}`).classList.toggle('popup');
		},
		setExif() {
			let imgs = document.querySelectorAll('.image');
			for (let img of imgs) {
				img.addEventListener('mouseover', async () => {
					img.style.opacity = '1';
					const exifData = await this.fetchExif(img.id);
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
		},
		async fetchExif(id) {
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
		},
		hideNext(pageNum) {
			const pageSelect = document.getElementById('page-select');
			const nextButton = document.querySelector('.btn-next');
			pageNum == pageSelect.options.length || pageSelect.options.length === 0
				? (nextButton.style.display = 'none')
				: (nextButton.style.display = 'inherit');
		},
		hidePrevious(pageNum) {
			const prevButton = document.querySelector('.btn-previous');
			pageNum == 1 || pageNum == 0 ? (prevButton.style.display = 'none') : (prevButton.style.display = 'inherit');
		}
	};
})();

const init = (() => {
	let pageNum = 1;
	let pageSelect = document.getElementById('page-select');

	pageSelect.addEventListener('change', (e) => {
		pageNum = e.target.value;
		controller.renderGallery(pageNum);
	});

	document.querySelector('.search-btn').addEventListener('click', (e) => {
		e.preventDefault();
		pageSelect.options.length = 0;
		controller.listAdd = false;
		pageNum = 1;
		searchText = document.getElementById('search').value;
		controller.renderGallery(pageNum);
	});

	document.querySelector('.btn-next').addEventListener('click', () => {
		if (pageNum < pageSelect.length) {
			pageNum++;
			controller.renderGallery(pageNum);
			window.scrollTo(0, 0);
			pageSelect.value = pageNum;
		}
	});

	document.querySelector('.btn-previous').addEventListener('click', () => {
		if (pageNum > 1) {
			pageNum--;
			controller.renderGallery(pageNum);
			window.scrollTo(0, 0);
			pageSelect.value = pageNum;
		}
	});

	controller.renderGallery(pageNum);
})();
