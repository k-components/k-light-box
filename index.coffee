module.exports = class Lightbox
  view: __dirname
  name: 'k-light-box'
  listeners: { insert: [], change: [] }

  destroy: ->
    for type, y of @listeners
      for listener in y
        if @path
          @model.root.removeListener type, listener
        else if @item
          @item.removeListener type, listener

    @listeners = { insert: [], change: [] }
    @deEnumerateImages()

  create: ->
    @listeners = { insert: [], change: [] }
    @selector = @getAttribute('selector')
    @path = @getAttribute('path')
    @item = @getAttribute('item')

    if @path
      @listeners.insert.push(@model.root.on 'insert', "#{@path}.**", @enumerateImagesDelayed)
      @listeners.change.push(@model.root.on 'change', "#{@path}.**", @enumerateImagesDelayed)
    else if @item
      @listeners.insert.push(@item.at('**').on 'insert', @enumerateImagesDelayed)
      @listeners.change.push(@item.at('**').on 'change', @enumerateImagesDelayed)

    setTimeout @enumerateImages, 100

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
    @model.set 'src', (@current.dataset?.srcl || @current.src)
    setTimeout @bindButtons, 1

  cancel: (e) =>
    e.stopPropagation() if e
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
    document.addEventListener 'keydown', @keydown, true
    try
      document.getElementById('dl-button-right').addEventListener 'click', @next, true
      document.getElementById('dl-button-left').addEventListener 'click', @prev, true
    catch err

  unbindButtons: =>
    document.removeEventListener 'keydown', @keydown, true
    try
      document.getElementById('dl-button-right').removeEventListener 'click', @next
      document.getElementById('dl-button-left').removeEventListener 'click', @prev
    catch err

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
