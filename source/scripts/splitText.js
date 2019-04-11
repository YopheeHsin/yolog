const splitText = (el, options = {}) => {
	const {
		splitRegex,
		tagName,
		classPrefix
	} = {
		splitRegex: null,
		tagName: 'span',
		classPrefix: 'char',
		...options
	}

	el.normalize()
	let count = 1

	const inject = el => {
		const parentNode = el.parentNode
		const str = el.nodeValue
		const split = splitRegex ? str.split(splitRegex) : str
		const l = split.length
		let i = -1
		while (++i < l) {
			const node = document.createElement(tagName)
			if (classPrefix) {
				node.className = classPrefix + count
				count++
			}
			node.appendChild(document.createTextNode(split[i]))
			node.setAttribute('aria-hidden', 'true')
			parentNode.insertBefore(node, el)
		}
		if (str.trim() !== '') {
			parentNode.setAttribute('aria-label', str)
		}
		parentNode.removeChild(el)
	}

	(function traverse(el) {
		if (el.nodeType === 3) {
			return inject(el)
		}

		const childNodes = [].slice.call(el.childNodes)
		const l = childNodes.length

		if (l === 1 && childNodes[0].nodeType === 3) {
			return inject(childNodes[0])
		}

		let i = -1
		while (++i < l) {
			traverse(childNodes[i])
		}
	}(el))
}