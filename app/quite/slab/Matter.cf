window.Matter = class Matter extends Block
  piece: {}
  build: ->
    @piece = P.span('')

  constructor:  ->
    super
    # @build()
    # @render()
    # @on 'change', @render
    # @on 'destroy', =>
    #   @piece.destroy()

  render: (@D)->
    # model = @getTemplateData()
    element = @piece.elmt
    holders = element.getElementsByClassName('pieceHolder')
    elmts = []
    for elmt in holders
      elmts.push elmt
    if element.className?.indexOf('pieceHolder') != -1
      elmts.push element

    for elmt in elmts
      attr = elmt.getAttribute('data-holderid')
      attrView = @["#{attr}View"]
      if attrView?(@D[attr])
        elmt.innerHTML = attrView(@D[attr]).elmt?.outerHTML
      else
        elmt.innerText = @D[attr]
    @
