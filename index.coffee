module.exports = class Lightbox
  view: __dirname
  name: 'k-light-box'

  destroy: ->
    @path.removeListener 'insert', @enumerateImagesDelayed
    @path2.removeListener 'change', @enumerateImagesDelayed
    @deEnumerateImages()

  create: ->
    @ts = Date.now()
    @selector = @getAttribute('selector')
    path = @getAttribute('path')
    if path
      @path = @model.root.at("#{path}.**")
      @path2 = @model.root.at("#{path}.**.html")
      @path.on 'insert', @enumerateImagesDelayed
      @path2.on 'change', @enumerateImagesDelayed
    @enumerateImages()

  deEnumerateImages: =>
    @enumerateImages 'removeEventListener'

  enumerateImagesDelayed: =>
    window.setTimeout @enumerateImages, 2500

  enumerateImages: (fn = 'addEventListener') =>
    if @selector
      @elements = document.querySelectorAll(@selector)
      for el in @elements
        el[fn] 'click', @show
        el.classList.add 'd-l'

  show: (e) =>
    if e
      @current = e.srcElement or e.target or e.toElement
    @model.set 'src', @current.src
    setTimeout @bindButtons, 1

  cancel: (e) =>
    @unbindButtons()
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

  bindButtons: =>
    console.log(document)
    document.addEventListener 'keydown', @keydown, true
    document.getElementById('dl-button-right').addEventListener 'click', @next, true
    document.getElementById('dl-button-left').addEventListener 'click', @prev, true

  unbindButtons: =>
    document.removeEventListener 'keydown', @keydown, true
    document.getElementById('dl-button-right').removeEventListener 'click', @next
    document.getElementById('dl-button-left').removeEventListener 'click', @prev

  next: (e) =>
    e.stopPropagation() if e
    next = false
    for el in @elements
      if next
        @current = el
        @show()
        break
      next = true if el is @current

  prev: (e) =>
    e.stopPropagation() if e
    prev = false
    for el in @elements
      if el is @current and prev
        @current = prev
        @show()
        break
      prev = el
