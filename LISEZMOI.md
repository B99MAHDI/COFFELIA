# Site Coffelia (pages séparées + Supabase)

Pages : `index.html` (accueil), `catalogue.html`, `acheter.html?id=…` (page d’achat), `connexion.html` (connexion admin), `admin.html` (gestion : ajout, disponibilité, suppression, numéro WhatsApp).
Fichiers communs : `style.css`, `common.js`, `config.js`. Base : `schema.sql`.

## Mise en route
1. Créez un projet Supabase et exécutez `schema.sql` dans le SQL Editor (ou, si la table existe déjà, les deux lignes `alter table` en bas du fichier).
2. Authentication : désactivez les inscriptions publiques, créez votre utilisateur admin (e-mail confirmé).
3. Déclarez-le : `insert into public.admins (user_id) select id from auth.users where email = 'VOTRE_EMAIL';`
4. Remplissez `config.js` (URL du projet + clé `anon`, jamais la clé `service_role`).
5. Poussez tous les fichiers à la racine du dépôt GitHub (Settings > Pages > branche main, dossier /root).

## Utilisation
Les clients utilisent l’accueil, le catalogue et la page d’achat (WhatsApp, virement en privé). Vous vous connectez sur `connexion.html` : aucun lien vers cette page n’est affiché sur le site.
