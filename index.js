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
      return this.deEnumerateImages();
    }

    create() {
      this.itemslistener = null;
      this.listeners = { insert: [], change: [] };
      this.selector = this.getAttribute('selector');
      this.exclude = this.getAttribute('exclude');
      this.path = this.getAttribute('path');
      this.item = this.getAttribute('item');
      this.items = this.getAttribute('items');

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

      return setTimeout(this.enumerateImages, 100);
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
        this.elements = document.querySelectorAll(this.selector);
        const exclude = this.exclude ? document.querySelectorAll(this.exclude) : [];

        for (var el of Array.from(this.elements)) {
          if (!Array.from(exclude).includes(el)) {
            el[fn]('click', this.show);
            el.classList.add('d-l');
          }
        }
      }
    }

    show(e) {
      if (e) {
        this.current = e.srcElement || e.target || e.toElement;
      }

      if (this.model.get('src.type') == 'video' && this.current.nodeName == 'SOURCE') {
        this.model.del('src');
      }
      
      this.model.set('src', {
        type: this.current.nodeName == 'IMG' ? 'image' : 'video',
        src: ((this.current.dataset != null ? this.current.dataset.srcl : undefined) || this.current.src)
      });
      this.emit('show');
      return setTimeout(this.bindButtons, 1);
    }

    cancel(e) {
      if (e) { e.stopPropagation(); }
      this.unbindButtons();
      this.model.del('src');
      return this.emit('hide');
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
        e.stopPropagation();
        return this.cancel();
      }
    }

    bindButtons() {
      window.addEventListener('keydown', this.keydown, true);
      try {
        document.getElementById('dl-button-right').addEventListener('click', this.next, true);
        return document.getElementById('dl-button-left').addEventListener('click', this.prev, true);
      } catch (err) { }
    }

    unbindButtons() {
      window.removeEventListener('keydown', this.keydown, true);
      try {
        document.getElementById('dl-button-right').removeEventListener('click', this.next);
        return document.getElementById('dl-button-left').removeEventListener('click', this.prev);
      } catch (err) { }
    }

    next(e) {
      if (e) { e.stopPropagation(); }
      let next = false;
        for (var el of Array.from(this.elements)) {
          if (next) {
            this.current = el;
            this.show();
            break;
          }
          if (el === this.current) { next = true; }
        }
    }

    prev(e) {
      if (e) { e.stopPropagation(); }
      let prev = false;
        for (var el of Array.from(this.elements)) {
          if ((el === this.current) && prev) {
            this.current = prev;
            this.show();
            break;
          }
          prev = el;
        }
    }
  };
  Lightbox.initClass();
  return Lightbox;
})());
