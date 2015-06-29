k-light-box
====

Very light lightbox for Derby.js.

Uses [flexbox](http://caniuse.com/#feat=flexbox), so not totally compatible with every browser. Also expects http://fontawesome.io/ because of laziness.

May burn houses down etc. Improvements are welcome.

##Demo

https://derby-demos.herokuapp.com/k-light-box

##Install

`npm install k-light-box`


##Setup

```coffeescript
app.component(require('k-light-box'))
```

```css
@import 'node_modules/k-light-box'
```

##Usage

```html
<k-light-box selector="#article img"></k-light-box>
```

This will apply the lightbox to the elements found by the `selector`.

License
-------

[MIT](http://opensource.org/licenses/mit-license.php)
