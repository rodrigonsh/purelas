$(".tabs button").click(function(ev){

  var target = ev.currentTarget;
  setPage(target.dataset.page)

})
