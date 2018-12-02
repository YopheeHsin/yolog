function addEventListener(el, eventName, handler) {
	if (el.addEventListener) {
		el.addEventListener(eventName, handler);
	} else {
		el.attachEvent('on' + eventName, function() {
			handler.call(el);
		});
	}
}

function toggleClass(el, className) {
	if (el.classList) {
		el.classList.toggle(className);
	} else {
		var classes = el.className.split(' ');
		var existingIndex = -1;
		for (var i = classes.length; i--;) {
			if (classes[i] === className) existingIndex = i;
		}
		if (existingIndex >= 0) {
			classes.splice(existingIndex, 1);
		} else {
			classes.push(className);
		}
		el.className = classes.join(' ');
	}
}

var btn = document.querySelector('.toggle-menu-btn');
var header = document.querySelector('header');
addEventListener(btn, 'click', function() {
	toggleClass(header, 'open');
});

var about_link_node = document.createElement('li');
document.querySelector('.category-list').appendChild(about_link_node);
