const { cp } = require("node:fs");

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
let Lightbox;
module.exports = (Lightbox = (function () {
	Lightbox = class Lightbox {
		constructor() {
			this.deEnumerateImages = this.deEnumerateImages.bind(this);
			this.enumerateImagesDelayed = this.enumerateImagesDelayed.bind(this);
			this.enumerateImages = this.enumerateImages.bind(this);
			this.show = this.show.bind(this);
			this.showInFolder = this.showInFolder.bind(this);
			this.cancel = this.cancel.bind(this);
			this.keydown = this.keydown.bind(this);
			this.bindButtons = this.bindButtons.bind(this);
			this.unbindButtons = this.unbindButtons.bind(this);
			this.next = this.next.bind(this);
			this.prev = this.prev.bind(this);
		}

		static initClass() {
			this.prototype.view = __dirname;
			this.prototype.name = 'k-light-box';
			this.prototype.listeners = { insert: [], change: [] };
		}

		destroy() {
			for (var type in this.listeners) {
				var y = this.listeners[type];
				for (var listener of Array.from(y)) {
					if (this.path) {
						this.model.root.removeListener(type, listener);
					} else if (this.item) {
						this.item.removeListener(type, listener);
					}
				}
			}

			if (this.items && this.itemslistener) {
				this.items.removeListener('insert', this.itemslistener);
				this.itemslistener = null;
			}

			this.listeners = { insert: [], change: [] };
			this.unbindButtons();
			this.deEnumerateImages();
		}

		create() {
			this.itemslistener = null;
			this.listeners = { insert: [], change: [] };
			this.selector = this.getAttribute('selector');
			this.exclude = this.getAttribute('exclude');
			this.path = this.getAttribute('path');
			this.item = this.getAttribute('item');
			this.items = this.getAttribute('items');

			if (this.model.get('folder')) {
				const $folder = this.model.root.at(`folders.${this.model.get('folder')}`);
				$folder.subscribe(() => {
					this.folder = $folder.get();
				});
			}

			if (this.items) {
				this.itemslistener = this.items.on('insert', this.enumerateImagesDelayed);
			}

			if (this.path) {
				this.listeners.insert.push(this.model.root.on('insert', `${this.path}.**`, this.enumerateImagesDelayed));
				this.listeners.change.push(this.model.root.on('change', `${this.path}.**`, this.enumerateImagesDelayed));
			} else if (this.item) {
				this.listeners.insert.push(this.item.at('**').on('insert', this.enumerateImagesDelayed));
				this.listeners.change.push(this.item.at('**').on('change', this.enumerateImagesDelayed));
			}

			setTimeout(this.enumerateImages, 100);
		}

		deEnumerateImages() {
			return this.enumerateImages('removeEventListener');
		}

		enumerateImagesDelayed() {
			return window.setTimeout(this.enumerateImages, 2500);
		}

		enumerateImages(fn) {
			if (fn == null) { fn = 'addEventListener'; }
			if (this.selector) {
				const elements = document.querySelectorAll(this.selector);
				const exclude = this.exclude ? document.querySelectorAll(this.exclude) : [];

				for (var el of Array.from(elements)) {
					if (!Array.from(exclude).includes(el)) {
						el[fn]('click', (e) => {
							this.show(e, true);
						});
						el.classList.add('d-l');
					}
				}

				if (!this.model.get('folder')) {
					this.elements = elements;
				}
			}
		}

		isImage(type) {
			return ((type != null ? type.indexOf('image') : undefined) === 0) && (type !== 'image/x-xcf');
		}

		isVideo(type) {
			if (type == null) { type = ''; }
			return type.indexOf('video') === 0;
		}

		show(e, initial) {
			if (e) {
				this.current = e.srcElement || e.target || e.toElement;
			}

			if (this.current) {
				if (this.model.get('src.type') == 'video' && this.current.nodeName == 'SOURCE') {
					this.model.del('src');
				}

				this.model.set('src', {
					type: this.current.nodeName == 'IMG' ? 'image' : 'video',
					src: ((this.current.dataset != null ? this.current.dataset.srcl : undefined) || this.current.src)
				});
				this.emit('show');

				if (initial) {
					setTimeout(this.bindButtons, 1);
				}
			}
		}

		showInFolder(next) {
			if (this.folder && this.model.get('currentPointer')) {
				const items = this.folder.items || [];
				const index = items.findIndex((el) => el == this.model.get('currentPointer'));
				let nextIndex;

				if (index != -1) {
					if (next) {
						nextIndex = index < items.length - 1 ? index + 1 : 0;
					} else {
						nextIndex = index > 0 ? index - 1 : items.length - 1;
					}

					this.model.set('currentPointer', items[nextIndex]);
					const $files = this.model.root.query('files2', { pointer: this.model.get('currentPointer'), $sort: { created: -1 } });
					const filepointer = this.model.get('filepointer');

					$files.subscribe(() => {
						const files = $files.get();

						if (files.length) {
							const file = files[0];
							const type = this.isImage(file.contenttype) ? 'image' : (this.isVideo(file.contenttype) ? 'video' : '');

							if (type) {
								const src = `/file/browser/${filepointer.id}/${file.id}/${filepointer.name}` + (type == 'video' ? '#t=0.001' : '');

								this.model.set('src', {
									type,
									src
								});
							}
						}
					});
				}
			}
		}

		cancel(e) {
			if (e) { e.stopPropagation(); }
			this.model.del('src');
			this.emit('hide');
		}

		keydown(e) {
			const key = e.keyCode || e.which;

			if (key === 37) {
				e.stopPropagation();
				return this.prev();
			} else if (key === 39) {
				e.stopPropagation();
				return this.next();
			} else if (key === 27) {
				e.stopImmediatePropagation();
				return this.cancel();
			}
		}

		bindButtons() {
			window.addEventListener('keydown', this.keydown, true);

			try {
				document.getElementById('dl-button-right').addEventListener('click', this.next, true);
				document.getElementById('dl-button-left').addEventListener('click', this.prev, true);
			} catch (err) {
				console.log(err)
			}
		}

		unbindButtons() {
			window.removeEventListener('keydown', this.keydown, true);
			try {
				document.getElementById('dl-button-right').removeEventListener('click', this.next);
				document.getElementById('dl-button-left').removeEventListener('click', this.prev);
			} catch (err) { }
		}

		next(e) {
			if (e) { e.stopPropagation(); }
			let next = false;

			if (this.elements) {
				for (var el of Array.from(this.elements)) {
					if (next) {
						this.current = el;
						this.show();
						break;
					}
					if (el === this.current) { next = true; }
				}
			} else this.showInFolder(true);
		}

		prev(e) {
			if (e) { e.stopPropagation(); }
			let prev = false;

			if (this.elements) {
				for (var el of Array.from(this.elements)) {
					if ((el === this.current) && prev) {
						this.current = prev;
						this.show();
						break;
					}
					prev = el;
				}
			} else this.showInFolder(false);
		}
	};
	Lightbox.initClass();
	return Lightbox;
})());
