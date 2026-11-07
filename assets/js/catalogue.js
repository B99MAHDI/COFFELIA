(function(){
  var C=Coffelia,items=[],filter="all";
  function render(){
    var g=C.$("grid");g.textContent="";
    var shown=items.filter(function(it){return filter==="all"||it.type===filter});
    C.$("chips").hidden=items.length===0;
    C.$("empty").hidden=shown.length>0;
    C.$("empty").textContent=items.length?"Aucun article dans cette catégorie pour le moment.":"Les premiers articles arrivent bientôt. En attendant, retrouvez-les sur Instagram.";
    shown.forEach(function(it,i){g.append(C.card(it,i))});
  }
  document.querySelectorAll(".chip").forEach(function(c){
    c.addEventListener("click",function(){
      filter=c.getAttribute("data-f");
      document.querySelectorAll(".chip").forEach(function(x){x.setAttribute("aria-pressed",x===c?"true":"false")});
      render();
    });
  });
  C.products().then(function(l){items=l;render()}).catch(function(){C.$("empty").hidden=false;C.$("empty").textContent="Le catalogue est momentanément indisponible. Retrouvez-nous sur Instagram."});
})();
