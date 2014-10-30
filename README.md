d-light-box
====

Very light lightbox for Derby.js.

Uses [flexbox](http://caniuse.com/#feat=flexbox), so not totally compatible with every browser. Also expects http://fontawesome.io/ because of laziness.

May burn houses down etc. Improvements are welcome.

##Install

`npm install d-light-box`


##Setup

```coffeescript
app.component(require('d-light-box'))
```

```css
@import 'node_modules/d-light-box'
```

##Usage

```html
<d-light-box selector="#article img"></d-light-box>
```

This will apply the lightbox to the elements found by the `selector`.

License
-------

[MIT](http://opensource.org/licenses/mit-license.php)
