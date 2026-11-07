# Coffelia

Site vitrine et boutique de mugs et verres à café (@coffelia1). React + Vite, base de données Supabase, déploiement automatique sur GitHub Pages.

## Structure des fichiers

```
COFFELIA/
├── index.html                  Page d'entrée de l'application
├── package.json                Dépendances et commandes
├── vite.config.js              Configuration de Vite
├── public/favicon.png
├── src/
│   ├── main.jsx                Démarrage de React et du routeur
│   ├── App.jsx                 Liste des pages (routes)
│   ├── config.js               URL Supabase et clé anon (à remplir)
│   ├── pages/                  Home, Catalogue, Buy, Login, Admin, NotFound
│   ├── components/             Header, Footer, ProductCard, layouts, illustrations
│   ├── hooks/                  useProducts, useAdmin, usePageTitle
│   ├── lib/                    supabase.js, api.js (requêtes), utils.js
│   ├── styles/style.css        Styles de tout le site
│   └── assets/                 fonts/ et img/ (logo)
├── database/schema.sql         Tables, sécurité (RLS) et stockage des photos
└── .github/workflows/deploy.yml  Déploiement automatique
```

## Adresses du site
`/#/` accueil · `/#/catalogue` · `/#/acheter/ID` · `/#/admin/connexion` · `/#/admin` (gestion)

## Mise en route
1. Supabase : exécutez `database/schema.sql` (SQL Editor), créez votre utilisateur admin, puis
   `insert into public.admins (user_id) select id from auth.users where email = 'VOTRE_EMAIL';`
2. Remplissez `src/config.js` (URL du projet + clé `anon`, jamais la clé `service_role`).
3. En local : `npm install` puis `npm run dev`.
4. Publication : poussez sur la branche `main`. Dans GitHub, Settings > Pages > Source : **GitHub Actions**. Chaque `git push` reconstruit et publie le site.

## Accès administrateur
Lien « Espace admin » en bas de chaque page, ou `/#/admin/connexion`.
