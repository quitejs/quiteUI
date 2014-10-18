window.R = class Route
  currentCommand: []
  currentPipers: []
  currentPage: {}
  lastPipers: []
  pages: {}

  constructor: (@body)->
    # init
    if(!window.location.hash) 
      window.location.hash = "#lei,changyong,1"
      currenthash = "#lei,changyong,1"

  route: ->
    hash = window.location.hash.split('#')[1]
    currenthash = ''
    window.onhashchange = ->
      hash = window.location.hash.split('#')[1]
      command = hash.split('|')[0]
      # //hash = hash.slice(1, hash.length)
      pipers = hash.split('|')[1..]

      if command is @currentCommand
        if pipers is @currentPipers 
          return
        else
          @lastPipers = @currentPipers
          @currentPipers = pipers

          runPipers()
      else
        @currentCommand = command
        [commandName, args...] = command.split(',')
        command = require "page/#{commandName}/index"
        @currentPage.hide()
        @body.appendChild 





  runPipers: ->
    startRun = false
    for piper, index in @currentPipers
      if(not startRun) or (piper is lastPipers[index])
        return
        [piperName, args...] = pipers.split ','

