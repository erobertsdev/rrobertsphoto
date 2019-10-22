let imgs;
let gallery = document.getElementById('gallery');

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
		console.log('Error retrieving photos :( Flickr may be experiencing issues.', err);
	});

// Assigns onclick event to individual images using their id after fetch builds list
// Will use later to gather EXIF data and hopefully display full-size image
setInterval(() => {
	imgs = document.querySelectorAll('img');
	for (let i = 0; i < imgs.length; i++) {
		let img = imgs[i];
		img.onclick = function() {
			console.log(this.id);
		};
	}
}, 2000);
