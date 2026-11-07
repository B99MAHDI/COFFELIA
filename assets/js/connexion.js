(function(){
  var C=Coffelia;
  function say(t){C.$("status").textContent=t}
  if(!C.sb){say("Connexion à la base impossible. Vérifiez config.js.");return}
  C.isAdmin().then(function(ok){if(ok)location.replace(C.url("pages/admin/gestion.html"))}).catch(function(){});
  C.$("loginForm").addEventListener("submit",async function(e){
    e.preventDefault();var b=C.$("lBtn");b.disabled=true;say("Connexion…");
    try{
      var r=await C.sb.auth.signInWithPassword({email:C.$("lEmail").value.trim(),password:C.$("lPass").value});
      if(r.error){say("E-mail ou mot de passe incorrect.");b.disabled=false;return}
      if(await C.isAdmin()){location.replace(C.url("pages/admin/gestion.html"));return}
      await C.sb.auth.signOut();say("Ce compte n’a pas accès à la gestion.");
    }catch(err){say("Connexion impossible. Réessayez.")}
    b.disabled=false;
  });
})();
