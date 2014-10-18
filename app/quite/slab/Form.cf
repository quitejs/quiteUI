window.Form = class Form extends Block
  constructor: (className)->
    super
    @piece = P.div(className)
  build: ->
    @piece = P.div(className)

  trigger: (@_trigger) =>
    console.log 'trigger', @_trigger
    @piece.C(@_trigger)
    @_trigger.onclick =>
      if @_before
        @_before()
      inputs = $('input[name], textarea[name]', @piece.elmt)
      console.log inputs
      param = {}
      for input in inputs
        input = $(input)
        param[input.attr('name')] = input.val()

      if Bus.user
        param.acntId = Bus.user.id
        param.acntToken = Bus.user.token

      success = (data, status, obj) =>
        console.log 'data', data
        console.log obj
        @_cb(data)

      post = $.post @_url, param, success, 'json'
      post.fail (xhr, status, error)=>
        console.log 'fail', status, error
        @_cb()
    @piece.elmt.onkeyup = (e) =>
      if e.which is 13
        @_trigger.click()
    @

  before: (@_before) ->
    @
  cb: (@_cb) ->
    @

  url: (@_url) ->
    @




