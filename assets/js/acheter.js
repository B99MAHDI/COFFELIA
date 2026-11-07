(function(){
  var C=Coffelia,box=C.$("checkout");
  function say(t){box.textContent="";box.append(C.el("p","intro",t))}
  function show(it,wa){
    box.textContent="";
    var wrap=C.el("div","checkout"),img=C.el("img","photo");img.src=it.url;img.alt=it.name;
    var side=C.el("div");
    side.append(C.el("p","kind",C.typeLabel(it.type)),C.el("h2",null,it.name),C.el("p","big",C.price(it)));
    if(it.desc)side.append(C.el("p","intro",it.desc));
    if(!it.available){
      side.append(C.el("p","intro","Cet article est épuisé pour le moment. Écrivez-nous sur Instagram pour savoir quand il revient."));
    }else if(wa){
      side.append(C.el("h3",null,"Paiement par virement, en privé"));
      var ol=C.el("ol");["Indiquez votre nom (facultatif).","Continuez sur WhatsApp : le message est déjà prêt.","Nous vous envoyons les coordonnées pour le virement."].forEach(function(t){ol.append(C.el("li",null,t))});
      var lab=C.el("label",null,"Votre nom"),inp=C.el("input");inp.type="text";inp.maxLength=60;inp.autocomplete="name";lab.append(inp);
      var go=C.el("a","btn","Continuer sur WhatsApp");go.target="_blank";go.rel="noopener";
      var link=function(){var n=inp.value.trim();go.href="https://wa.me/"+wa+"?text="+encodeURIComponent("Bonjour Coffelia, je souhaite acheter l’article « "+it.name+" » ("+C.price(it)+")."+(n?" Mon nom : "+n+".":"")+" Pouvez-vous m’envoyer les coordonnées pour le virement ?")};
      inp.addEventListener("input",link);link();side.append(ol,lab,go);
    }else{
      side.append(C.el("p","intro","Le contact WhatsApp n’est pas encore disponible. Écrivez-nous sur Instagram pour acheter cet article."));
      var ig=C.el("a","btn","Écrire sur Instagram");ig.href=C.INSTA;ig.target="_blank";ig.rel="noopener";side.append(ig);
    }
    wrap.append(img,side);box.append(wrap);
  }
  var id=new URLSearchParams(location.search).get("id");
  if(!id){say("Aucun article choisi. Retournez au catalogue pour en sélectionner un.");return}
  Promise.all([C.products(),C.whatsapp()]).then(function(r){
    var it=r[0].filter(function(x){return x.id===id})[0];
    if(!it){say("Cet article n’est plus disponible.");return}
    show(it,C.cleanWa(r[1]));
  }).catch(function(){say("Le catalogue est momentanément indisponible. Réessayez plus tard ou écrivez-nous sur Instagram.")});
})();
