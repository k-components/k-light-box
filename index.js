// Generated by CoffeeScript 1.10.0
(function() {
  var Lightbox,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = Lightbox = (function() {
    function Lightbox() {
      this.prev = bind(this.prev, this);
      this.next = bind(this.next, this);
      this.unbindButtons = bind(this.unbindButtons, this);
      this.bindButtons = bind(this.bindButtons, this);
      this.keydown = bind(this.keydown, this);
      this.cancel = bind(this.cancel, this);
      this.show = bind(this.show, this);
      this.enumerateImages = bind(this.enumerateImages, this);
      this.enumerateImagesDelayed = bind(this.enumerateImagesDelayed, this);
    }

    Lightbox.prototype.view = __dirname;

    Lightbox.prototype.name = 'k-light-box';

    Lightbox.prototype.create = function() {
      var path;
      this.selector = this.getAttribute('selector');
      path = this.getAttribute('path');
      if (path) {
        this.path = this.model.root.at(path + "**");
        this.path.on('insert', this.enumerateImagesDelayed);
      }
      return window.setTimeout(this.enumerateImages, 100);
    };

    Lightbox.prototype.enumerateImagesDelayed = function() {
      return window.setTimeout(this.enumerateImages, 2500);
    };

    Lightbox.prototype.enumerateImages = function() {
      var el, i, len, ref, results;
      if (this.selector) {
        this.elements = document.querySelectorAll(this.selector);
        ref = this.elements;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          el = ref[i];
          el.addEventListener('click', this.show);
          results.push(el.classList.add('d-l'));
        }
        return results;
      }
    };

    Lightbox.prototype.show = function(e) {
      if (e) {
        this.current = e.srcElement || e.target || e.toElement;
      }
      this.model.set('src', this.current.src);
      return setTimeout(this.bindButtons(), 1);
    };

    Lightbox.prototype.cancel = function(e) {
      this.unbindButtons();
      return this.model.del('src');
    };

    Lightbox.prototype.keydown = function(e) {
      var key;
      key = e.keyCode || e.which;
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
    };

    Lightbox.prototype.bindButtons = function() {
      document.addEventListener('keydown', this.keydown, true);
      document.getElementById('dl-button-right').addEventListener('click', this.next, true);
      return document.getElementById('dl-button-left').addEventListener('click', this.prev, true);
    };

    Lightbox.prototype.unbindButtons = function() {
      document.removeEventListener('keydown', this.keydown, true);
      document.getElementById('dl-button-right').removeEventListener('click', this.next);
      return document.getElementById('dl-button-left').removeEventListener('click', this.prev);
    };

    Lightbox.prototype.next = function(e) {
      var el, i, len, next, ref, results;
      if (e) {
        e.stopPropagation();
      }
      next = false;
      ref = this.elements;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        el = ref[i];
        if (next) {
          this.current = el;
          this.show();
          break;
        }
        if (el === this.current) {
          results.push(next = true);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Lightbox.prototype.prev = function(e) {
      var el, i, len, prev, ref, results;
      if (e) {
        e.stopPropagation();
      }
      prev = false;
      ref = this.elements;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        el = ref[i];
        if (el === this.current && prev) {
          this.current = prev;
          this.show();
          break;
        }
        results.push(prev = el);
      }
      return results;
    };

    return Lightbox;

  })();

}).call(this);
