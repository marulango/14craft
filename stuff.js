var baseURL = 'https://api.xivdb.com'
var $target = $('.autocompleteContent')

var $ul = document.createElement('div')

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
        var itemName = data.name
        itemClassName = itemName.replace(/\s+/g, '-').replace(/'/g, '').toLowerCase()
        console.log(itemClassName)
        $target.prepend('<div class="material-item ' + itemClassName + '"></div>')
        $('.' + itemClassName).append('<div class="itemName"><div class="remove"></div><h2>' + itemName + '</h2></div>')
        $('.' + itemClassName).append('<div class="matsHeader row"><div class="col-8"><label>Material</label></div><div class="col-4"><label>QTY</label></div></div>') // this could be a variable…?

        var craftableTree = data.tree
        if (craftableTree.length > 0 == true) {
          for (var i = 0; i < craftableTree.length; i++) {
            $('.' + itemClassName).append('<li class="row"><div class="col-8"><p>' + craftableTree[i].name + '</p></div><div class="col-4"><p>' + craftableTree[i].quantity + '</p></div></li>') // this can be much more legible. but idc about that rn
          }
        }
      })
    }
  })
})
