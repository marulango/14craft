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
        $('.' + itemWrapperName).append('<div class="craftableItemName"><div class="remove"></div><h2>' + craftableItemName + '</h2></div>')
        $('.' + itemWrapperName).append('<div class="matsHeader row"><div class="col-8"><label>Material</label></div><div class="col-4"><label>QTY</label></div></div>')

        var craftableTree = data.tree

        craftableTree.forEach((treeNode) => {
          var itemName = treeNode.name
          var itemQty = treeNode.quantity
          var itemSynths = treeNode.synths || {}
          console.log(itemName, itemQty)
          var innerWrapperName = itemName.replace(/\s+/g, '-').replace(/'/g, '').toLowerCase()
          $('.' + itemWrapperName).append('<li class="row mainMat"><div class="col-8"><p>' + itemName + '</p></div><div class="col-4"><p>' + itemQty + '</p></div></li>')
          Object.keys(itemSynths).forEach(key => {
            $('.' + itemWrapperName).append('<ul class="' + innerWrapperName + ' debug">Mats required for previous item</ul>')
            itemSynths[key].tree.forEach((material) => {
              var itemMats = material.name
              var itemMatsQty = material.quantity
              console.log('material name: ' + itemMats)
              $('.' + innerWrapperName).append('<li class="row"><div class="col-8"><p>' + itemMats + '</p></div><div class="col-4">' + itemMatsQty + '</div></li>')
            })
          })
        })
      })
    }
  })
})
