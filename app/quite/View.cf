Piece = require 'base/Piece'
Quite = require 'base/Quite'

module.exports = class View extends Quite
  conf: {}
  model: {}
  piece: {}

  constructor: (params) ->
    @piece = params?.piece
    @model = params?.model
    @conf = params?.conf ? {}

  rebirth: (@model) ->
    @render()

  remove: ->
    @piece.elmt.remove()

  getTemplateData: ->
    if @model.toJSON
      @model.toJSON()
    else
      @model

  render:  ->
    model = @getTemplateData()
    element = @piece.elmt
    holders = $('.pieceHolder')
    elmts = []
    for elmt in holders
      elmts.push elmt

    if element.className.indexOf('pieceHolder') != -1
      elmts.push element
    console.log 'elmts', elmts

    for elmt in elmts
      attr = elmt.getAttribute('data-holderid')
      console.log attr
      attrView = @conf?["#{attr}view"]
      if attrView
        p = attrView(model[attr])
        # if p instanceof Piece
        #   elmt.innerHTML = p.elmt.innerHTML
      else
        console.log attr
        elmt.textContent = model[attr]?.toString()
