module.exports = class LinkRadioSet extends RadioSet
  build: ->
    @_items || @_items = []
    @piece = P.div().C(
      P.ul('cates').C(
        for item in @_items
          item.build()
      )
    )


  LinkItem: class LinkItem extends Item
    build: ->
      @piece = P.li('cate').C(
        P.button('').C(@D.name).onclick =>
          @_set.select @
      )
