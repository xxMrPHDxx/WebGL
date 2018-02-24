function loadText(url){
	return fetch(url).then(response => response.text());
}

function loadJSON(url){
	return fetch(url).then(response => response.json());
}

function loadImage(url){
	return fetch(url).then(response => {
		let image = new Image();
		image.src = response.url;
		return image;
	});
}