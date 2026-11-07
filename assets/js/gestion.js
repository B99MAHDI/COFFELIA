(function(){
  var C=Coffelia,sb=C.sb;
  function say(t){C.$("status").textContent=t}
  function shrink(file){return new Promise(function(res,rej){var img=new Image(),u=URL.createObjectURL(file);img.onload=function(){var s=Math.min(1,900/Math.max(img.width,img.height)),c=document.createElement("canvas");c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej(new Error("image"))},"image/jpeg",.85)};img.onerror=function(){rej(new Error("image"))};img.src=u})}

  async function refresh(){
    var l=C.$("adminList");l.textContent="";
    var items=await C.products();
    C.$("fWa").value=await C.whatsapp();
    if(!items.length)l.append(C.el("p","note","Aucun article pour le moment."));
    items.forEach(function(it){
      var r=C.el("div","arow"),img=C.el("img");img.src=it.url;img.alt="";
      var label=C.el("span",null,it.name+" ("+C.typeLabel(it.type).toLowerCase()+") – "+C.price(it));
      if(!it.available)label.append(C.el("em","tag2","Épuisé"));
      var acts=C.el("div","acts");
      var t=C.el("button",null,it.available?"Marquer épuisé":"Remettre en vente");t.type="button";
      t.addEventListener("click",async function(){
        var u=await sb.from("products").update({available:!it.available}).eq("id",it.id);
        if(u.error){say("La modification a échoué.");return}
        refresh();
      });
      var d=C.el("button",null,"Supprimer");d.type="button";
      d.addEventListener("click",async function(){
        if(d.dataset.ask!=="1"){d.dataset.ask="1";d.textContent="Confirmer";return}
        var x=await sb.from("products").delete().eq("id",it.id);
        if(x.error){say("La suppression a échoué.");return}
        await sb.storage.from("products").remove([it.url.split("/").pop()]);
        refresh();
      });
      acts.append(t,d);r.append(img,label,acts);l.append(r);
    });
  }

  C.$("fPhoto").addEventListener("change",function(){
    var f=this.files[0],p=C.$("preview");
    if(!f){p.hidden=true;return}
    p.src=URL.createObjectURL(f);p.hidden=false;
  });

  C.$("addForm").addEventListener("submit",async function(e){
    e.preventDefault();var b=C.$("fBtn");b.disabled=true;say("Ajout en cours…");
    try{
      var blob=await shrink(C.$("fPhoto").files[0]),path=crypto.randomUUID()+".jpg";
      var u=await sb.storage.from("products").upload(path,blob,{contentType:"image/jpeg"});
      if(u.error)throw u.error;
      var url=sb.storage.from("products").getPublicUrl(path).data.publicUrl;
      var i=await sb.from("products").insert({
        name:C.$("fName").value.trim(),
        price:Number(C.$("fPrice").value),
        type:C.$("fType").value,
        description:C.$("fDesc").value.trim()||null,
        available:C.$("fAvail").checked,
        image_url:url
      });
      if(i.error)throw i.error;
      C.$("addForm").reset();C.$("preview").hidden=true;C.$("fAvail").checked=true;
      say("Article ajouté.");await refresh();
    }catch(err){say("L’ajout a échoué. Vérifiez la photo et votre connexion.")}
    b.disabled=false;
  });

  C.$("waForm").addEventListener("submit",async function(e){
    e.preventDefault();var raw=C.$("fWa").value.trim(),n=C.cleanWa(raw);
    if(raw&&!n){say("Numéro invalide. Vérifiez l’indicatif et les chiffres.");return}
    var r=await sb.from("settings").upsert({key:"whatsapp",value:n});
    say(r.error?"L’enregistrement a échoué.":"Numéro enregistré.");
  });

  C.$("logout").addEventListener("click",async function(e){
    e.preventDefault();
    if(sb)await sb.auth.signOut();
    location.replace(C.url("pages/admin/connexion.html"));
  });

  (async function(){
    try{
      if(!sb||!(await C.isAdmin())){location.replace(C.url("pages/admin/connexion.html"));return}
      C.$("panel").hidden=false;say("");await refresh();
    }catch(err){say("Connexion à la base impossible. Vérifiez config.js et votre connexion.")}
  })();
})();
