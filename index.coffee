module.exports = class Lightbox
	elements = null
	current = null
	view: __dirname
	name: 'd-light-box'
	create: ->
		selector = @model.get 'selector'
		if selector
			elements = document.querySelectorAll(selector)
			for el in elements
				el.addEventListener 'click', @show
				el.classList.add 'd-l'
	show: (e) =>
		if e
			current = e.srcElement or e.target or e.toElement
		@model.set 'src', current.src
		setTimeout @addEvents(), 1
	cancel: (e) =>
		@removeEvents()
		@model.del 'src'
	keydown: (e) =>
		key = e.keyCode or e.which
		if key is 37
			e.stopPropagation()
			@prev()
		else if key is 39
			e.stopPropagation()
			@next()
		else if key is 27
			e.stopPropagation()
			@cancel()
	addEvents: =>
		document.addEventListener 'keydown', @keydown, true
		document.getElementById('dl-button-right').addEventListener 'click', @next, true
		document.getElementById('dl-button-left').addEventListener 'click', @prev, true
	removeEvents: =>
		document.removeEventListener 'keydown', @keydown, true
		document.getElementById('dl-button-right').removeEventListener 'click', @next
		document.getElementById('dl-button-left').removeEventListener 'click', @prev
	next: (e) =>
		e.stopPropagation() if e
		next = false
		for el in elements
			if next
				current = el
				@show()
				break
			next = true if el is current
	prev: (e) =>
		e.stopPropagation() if e
		prev = false
		for el in elements
			if el is current and prev
				current = prev
				@show()
				break
			prev = el
