/* global $ */
var baseURL = 'https://api.xivdb.com'
var $target = $('.autocompleteContent')

$(document).on('click', '.remove', function (e) {
  $(e.target).parent().parent().remove()
})

$('#autocomplete').focus(function () {
  $(this).val('')
})

$.getJSON(`${baseURL}/recipe`, function (data) {
  var name = data.map(item => ({ label: item.name, value: item.name, id: item.id }))

  $('#autocomplete').autocomplete({
    source: (request, response) => {
      var matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex(request.term), 'i')
      var found = name.filter(item => matcher.test(item.label))
      response(found)
    },
    select: (event, ui) => {
      $.getJSON(`${baseURL}/recipe/${ui.item.id}`, function (data) {
        var craftableItemName = data.name
        var itemWrapperName = craftableItemName.replace(/\s+/g, '-').replace(/'/g, '').toLowerCase()
        $target.prepend('<div class="material-item ' + itemWrapperName + '"></div>')
        $('.' + itemWrapperName).append('<div class="craftableItemName"><h2>' + craftableItemName + '</h2><div class="remove"></div></div>')
        $('.' + itemWrapperName).append('<div class="matsHeader row"><div class="col-8"><label>Material</label></div><div class="col-4 matsQty "><label>QTY</label></div></div>')
        $('.' + itemWrapperName).append('<div class="' + itemWrapperName + '-list itemListWrapper"></div>')

        var craftableTree = data.tree

        craftableTree.forEach((treeNode) => {
          var itemName = treeNode.name
          var itemQty = treeNode.quantity
          var itemSynths = treeNode.synths || {}
          console.log(itemName, itemQty)
          var innerWrapperName = itemName.replace(/\s+/g, '-').replace(/'/g, '').toLowerCase()
          $('.' + itemWrapperName + '-list').append('<li class="row ' + innerWrapperName + '"><div class="col-8"><p>' + itemName + '</p></div><div class="col-4 matsQty"><p>' + itemQty + '</p></div></li>')

          Object.keys(itemSynths).forEach(key => {
            $('.' + innerWrapperName).append('<ul class="' + innerWrapperName + '-list"></ul>')
            itemSynths[key].tree.forEach((material) => {
              var itemMats = material.name
              var itemMatsQty = material.quantity
              console.log('material name: ' + itemMats)
              $('.' + innerWrapperName + '-list').append('<li class="row innerMat"><div class="col-8"><p>' + itemMats + '</p></div><div class="col-4 matsQty">' + itemMatsQty + '</div></li>')
            })
          })
        })
      })
    }
  })
})
