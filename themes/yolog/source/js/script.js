document.querySelector('.toggle-menu-btn').addEventListener('click', function() {
	document.querySelector('header').classList.toggle('open');
});

var aboutNode = document.createElement('li');
aboutNode.className = 'category-list-item';
aboutNode.innerHTML = '<a class="category-list-link" href="/uncategorized/about.html">About</a>';
document.querySelector('.category-list').appendChild(aboutNode);


function openIframe(url) {
	var body = document.body;
	var wrapper = document.createElement('div');
	wrapper.className = 'iframe-wrapper';

	var btn = document.createElement('button');
	btn.className = 'iframe-btn';

	wrapper.innerHTML = ('<iframe frameborder="0" src="' + url + '"></iframe>');
	wrapper.appendChild(btn);
	body.classList.add('over-hidden');
	body.appendChild(wrapper);

	function remove() {
		btn.removeEventListener('click', remove);
		body.removeChild(wrapper);
		body.classList.remove('over-hidden');
	}

	btn.addEventListener('click', remove);

	setTimeout(function() {
		wrapper.classList.add('open');
	}, 0);
}