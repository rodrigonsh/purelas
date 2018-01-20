$(".tabs button").click(function(ev){

  var target = ev.currentTarget;
  $navigator.dataset.page = target.dataset.page

})
