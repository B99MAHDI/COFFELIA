# Site Coffelia avec base de données Supabase

Fichiers : `index.html` (site client), `admin.html` (gestion, connexion obligatoire), `config.js`, `schema.sql`.

## Mise en route
1. Créez un projet sur supabase.com.
2. Ouvrez **SQL Editor**, collez tout `schema.sql` et exécutez-le.
3. Dans **Authentication**, désactivez les inscriptions publiques, puis créez votre utilisateur administrateur (e-mail + mot de passe, e-mail confirmé).
4. Dans le SQL Editor, exécutez : `insert into public.admins (user_id) select id from auth.users where email = 'VOTRE_EMAIL';`
5. Dans **Project Settings > API**, copiez l’URL du projet et la clé `anon` dans `config.js`.
6. Testez en local (`python3 -m http.server` dans le dossier), puis mettez le dossier en ligne sur Netlify, Vercel ou GitHub Pages.

## Utilisation
- Les clients voient `index.html` : catalogue, bouton Acheter, page d’achat avec contact WhatsApp pour un virement en privé.
- Vous vous connectez sur `admin.html` : ajout d’articles (nom, prix, photo), numéro WhatsApp, suppression. Aucun lien vers cette page n’est affiché aux clients.
- Pour ajouter un autre administrateur : créez-lui un utilisateur, puis ajoutez son identifiant dans la table `admins`.

## Sécurité
Seuls les comptes présents dans `admins` peuvent modifier les données ou les photos, grâce aux règles RLS. Les clients ne peuvent que lire le catalogue.
