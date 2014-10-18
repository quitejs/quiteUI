window.TableField = class TableField extends Block
  constructor: ->
    super
    @attrs(
      'title'
      'name'
      'autofocus'
    )

  save: ->
    @D[@_name] = @view.value()
    @

  # load: ->
  #   @view.value(@D[@_name])
  #   @

  val: (value) =>
    @view.value(value)
  build: ->
    @piece = P.tr().C(
      P.th().C("#{@_title}:")
      P.td().C(
        @buildView()
        @appendView
      )
    )

  buildView: ->
    @view = P.inputBox(@_name).name(@_name)
    if value = @D[@_name]
      @view.value(@D[@_name])
    if @_autofocus
      @view.autofocus(true)

    @view

  append: (@appendView) ->
    @


