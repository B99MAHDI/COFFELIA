# Coffelia

Site vitrine et boutique de mugs et verres à café (@coffelia1), avec base de données Supabase.

## Structure des fichiers

```
COFFELIA/
├── index.html                  Accueil
├── pages/
│   ├── catalogue.html          Catalogue avec filtre Mugs / Verres
│   ├── acheter.html            Page d'achat (?id=...)
│   └── admin/
│       ├── connexion.html      Connexion administrateur
│       └── gestion.html        Ajout d'articles, disponibilité, WhatsApp
├── assets/
│   ├── css/style.css           Styles de tout le site
│   ├── js/
│   │   ├── config.js           URL Supabase et clé anon (à remplir)
│   │   ├── common.js           Fonctions partagées (Supabase, cartes, chemins)
│   │   └── home.js, catalogue.js, acheter.js, connexion.js, gestion.js
│   └── img/                    logo.jpg, favicon.png
├── database/schema.sql         Tables, sécurité (RLS) et stockage des photos
└── README.md
```

## Mise en route
1. Créez un projet Supabase et exécutez `database/schema.sql` dans le SQL Editor.
2. Authentication : désactivez les inscriptions publiques, créez votre utilisateur admin.
3. Déclarez-le : `insert into public.admins (user_id) select id from auth.users where email = 'VOTRE_EMAIL';`
4. Remplissez `assets/js/config.js` (URL + clé `anon`, jamais la clé `service_role`).
5. Poussez le contenu à la racine du dépôt GitHub, puis Settings > Pages > branche main, dossier /root.

## Accès administrateur
Lien « Espace admin » en bas de chaque page, ou directement `pages/admin/connexion.html`.
