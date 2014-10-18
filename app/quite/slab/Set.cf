window.Set = class Set extends Quite
  constructor: ->
    super
    @attrs(
      'container'
      'blocks'
      'models'
      'init'
    )
    @_blocks = []

  build: ->
    @_piece = @_container.C(
      for model in @_models
        block = @_init model
        @_blocks.push block
        block.build()
    )

  remove: (position) ->


  move: (block, position) ->
    _.move @_blocks, block, position
    @_container.move block.piece.elmt, position

  insert: (block, position) ->
    _.insert @_blocks, block, position
    @_container.insert block.piece, position




  



