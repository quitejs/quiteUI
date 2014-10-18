Set = require 'base/Set'
module.exports = class RadioSet extends Set
  constructor: (models, options) ->
    super models, options
    @on 'add', (model) =>
      @select model
  selected: {}
  select: (model) ->
    @selected?.toggleSelect?()
    @selected = model
    @trigger 'select', model
    model.toggleSelect()

