Matter = require './Matter'
module.exports = class Editor extends Matter
  matter: {}
  delivery: =>
    # element = @piece.elmt
    # holders = $('.pieceHolder', element)
    # elmts = []
    # for elmt in holders
    #   elmts.push elmt
    #
    # if element.className.indexOf('pieceHolder') != -1
    #   elmts.push element
    #
    # for elmt in elmts
    #   attr = elmt.getAttribute('data-holderid')
    #   attrView = @["#{attr}View"]
    #   if attrView
    #     @set attr, attrView()
    #   else
    #     @set attr, elmt.textContent
    @matter.set @attributes
    @matter.save()
  accept: (@matter) =>
    @set @matter.attributes



