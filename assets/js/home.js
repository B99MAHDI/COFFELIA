(function(){
  var C=Coffelia,INK="#2B1710";
  function mug(c){return '<svg viewBox="0 0 200 180" aria-hidden="true"><path d="M82 30c-9-9 9-15 0-27M114 30c-9-9 9-15 0-27" fill="none" stroke="'+INK+'" stroke-width="4" stroke-linecap="round"/><path d="M44 56h112v60a40 40 0 0 1-40 40H84a40 40 0 0 1-40-40z" fill="'+c+'" stroke="'+INK+'" stroke-width="5" stroke-linejoin="round"/><path d="M156 74h10a20 20 0 0 1 0 42h-14" fill="none" stroke="'+INK+'" stroke-width="5" stroke-linecap="round"/><ellipse cx="100" cy="56" rx="56" ry="9" fill="#FFF3E4" stroke="'+INK+'" stroke-width="5"/><path d="M92 96c-8-9 0-16 8-8 8-8 16-1 8 8l-8 9z" fill="#FFF8F0"/></svg>'}
  function glass(c){return '<svg viewBox="0 0 200 180" aria-hidden="true"><path d="M66 8h68l-7 150a12 12 0 0 1-12 11H85a12 12 0 0 1-12-11z" fill="#FFFFFF" fill-opacity=".55" stroke="'+INK+'" stroke-width="5" stroke-linejoin="round"/><path d="M70 100h60l-3 54a9 9 0 0 1-9 9H82a9 9 0 0 1-9-9z" fill="'+c+'"/><path d="M69 68h62l-1.500 32h-59z" fill="#EBCFB4"/><path d="M68 38h64l-1.500 30h-61z" fill="#FFF8F0"/></svg>'}
  C.$("fa").innerHTML=mug("#F2A9A0");C.$("fb").innerHTML=glass("#5A3426");
  C.products().then(function(items){
    var list=items.filter(function(x){return x.available}).slice(0,3);
    if(!list.length){C.$("empty").textContent="Les premiers articles arrivent bientôt. En attendant, retrouvez-les sur Instagram.";return}
    C.$("empty").hidden=true;
    list.forEach(function(it,i){C.$("grid").append(C.card(it,i))});
  }).catch(function(){C.$("empty").textContent="Le catalogue est momentanément indisponible. Retrouvez-nous sur Instagram."});
})();
