// Generated by CoffeeScript 1.7.1
(function() {
  var Lightbox,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = Lightbox = (function() {
    var current, elements;

    function Lightbox() {
      this.prev = __bind(this.prev, this);
      this.next = __bind(this.next, this);
      this.removeEvents = __bind(this.removeEvents, this);
      this.addEvents = __bind(this.addEvents, this);
      this.keydown = __bind(this.keydown, this);
      this.cancel = __bind(this.cancel, this);
      this.show = __bind(this.show, this);
    }

    elements = null;

    current = null;

    Lightbox.prototype.view = __dirname;

    Lightbox.prototype.name = 'd-lightbox';

    Lightbox.prototype.create = function() {
      var el, selector, _i, _len, _results;
      selector = this.model.get('selector');
      if (selector) {
        elements = document.querySelectorAll(selector);
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          el.addEventListener('click', this.show);
          _results.push(el.classList.add('d-l'));
        }
        return _results;
      }
    };

    Lightbox.prototype.show = function(e) {
      if (e) {
        current = e.srcElement || e.target || e.toElement;
      }
      this.model.set('src', current.src);
      return setTimeout(this.addEvents(), 1);
    };

    Lightbox.prototype.cancel = function(e) {
      this.removeEvents();
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

    Lightbox.prototype.addEvents = function() {
      document.addEventListener('keydown', this.keydown, true);
      document.getElementById('dl-button-right').addEventListener('click', this.next, true);
      return document.getElementById('dl-button-left').addEventListener('click', this.prev, true);
    };

    Lightbox.prototype.removeEvents = function() {
      document.removeEventListener('keydown', this.keydown);
      document.getElementById('dl-button-right').removeEventListener('click', this.next);
      return document.getElementById('dl-button-left').removeEventListener('click', this.prev);
    };

    Lightbox.prototype.next = function(e) {
      var el, next, _i, _len, _results;
      if (e) {
        e.stopPropagation();
      }
      next = false;
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        if (next) {
          current = el;
          this.show();
          break;
        }
        if (el === current) {
          _results.push(next = true);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Lightbox.prototype.prev = function(e) {
      var el, prev, _i, _len, _results;
      if (e) {
        e.stopPropagation();
      }
      prev = false;
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        if (el === current && prev) {
          current = prev;
          this.show();
          break;
        }
        _results.push(prev = el);
      }
      return _results;
    };

    return Lightbox;

  })();

}).call(this);
