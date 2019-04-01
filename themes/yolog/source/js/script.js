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

	var iframe = document.createElement('iframe');
	iframe.setAttribute('frameborder', '0');
	iframe.src = url;
	iframe.onload = function() {
		wrapper.classList.add('open');
	};

	var btn = document.createElement('button');
	btn.className = 'iframe-btn';

	wrapper.appendChild(iframe);
	wrapper.appendChild(btn);
	body.classList.add('over-hidden');
	body.appendChild(wrapper);

	function remove() {
		btn.removeEventListener('click', remove);
		body.removeChild(wrapper);
		body.classList.remove('over-hidden');
	}

	btn.addEventListener('click', remove);
}