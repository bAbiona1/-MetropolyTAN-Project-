# API d'Optimisation de Trajets - Documentation

## Introduction

Cette API NodeJS fournit une interface de base pour gérer les données de transports publics (arrêts, lignes, modes, localisations) stockées dans une base de données MySQL. Elle offre des points de terminaison (endpoints) pour effectuer des opérations CRUD (Create, Read, Update, Delete) sur chaque table de la base de données.

**Nouveau dans la version 1.2.0 :** Ajout de l'authentification par token JWT pour sécuriser l'accès aux routes de l'API. Toutes les routes CRUD sont désormais protégées.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

*   **Node.js et npm:** [Télécharger et installer Node.js](https://nodejs.org/)
*   **Serveur MySQL:** Un serveur MySQL fonctionnel (local ou distant).
*   **Client MySQL:** Un outil pour interagir avec votre base de données MySQL (par exemple, MySQL Workbench, DBeaver, ou la ligne de commande `mysql`).

## Installation

1.  **Copier les fichiers du projet:** Placez tous les fichiers fournis (`server.js`, `db.js`, `swaggerDef.js`, `package.json`, les répertoires `routes/` et `middleware/`, et le fichier `carpooling_requests_V1.sql`) dans un répertoire de votre choix (par exemple, `transit_api`).
2.  **Ouvrir un terminal** dans le répertoire du projet (`transit_api`).
3.  **Installer les dépendances:** Exécutez la commande suivante pour installer ou mettre à jour les paquets Node.js nécessaires (y compris `express`, `mysql2`, `swagger-jsdoc`, `swagger-ui-express`, `jsonwebtoken`, et `bcryptjs`) :
    ```bash
    npm install
    ```
    *Si vous mettez à jour une version existante, cette commande installera les nouvelles dépendances pour l'authentification et Swagger.*

## Configuration de la Base de Données

1.  **Créer la base de données:** Connectez-vous à votre serveur MySQL et créez une nouvelle base de données. Vous pouvez choisir le nom que vous voulez (par exemple, `transit_db`).
    ```sql
    CREATE DATABASE transit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```
2.  **Configurer la connexion:** Ouvrez le fichier `db.js`. Modifiez les informations de connexion pour correspondre à votre configuration MySQL :
    *   `host`: L'adresse de votre serveur MySQL (souvent `localhost`).
    *   `user`: Votre nom d'utilisateur MySQL.
    *   `password`: Votre mot de passe MySQL.
    *   `database`: Le nom de la base de données que vous venez de créer (`transit_db` dans l'exemple).

    **Alternative (Recommandé):** Utilisez des variables d'environnement pour ces informations sensibles. Le code essaiera d'abord de lire `DB_HOST`, `DB_USER`, `DB_PASSWORD`, et `DB_NAME` depuis l'environnement.

3.  **Exécuter le script SQL:** Utilisez votre client MySQL pour exécuter le script `carpooling_requests_V1.sql` sur la base de données que vous avez créée. Cela créera les tables nécessaires (`location`, `mode`, `line`, `stop`, et la nouvelle table `users`). Le script insère également un utilisateur administrateur par défaut.

    *   **Via la ligne de commande:**
        ```bash
        mysql -u VOTRE_USER -p VOTRE_DATABASE < carpooling_requests_V1.sql
        ```
        Remplacez `VOTRE_USER` par votre nom d'utilisateur MySQL et `VOTRE_DATABASE` par le nom de votre base de données. Vous serez invité à entrer votre mot de passe.
    *   **Via un outil graphique (MySQL Workbench, DBeaver):** Ouvrez le fichier `carpooling_requests_V1.sql`, connectez-vous à votre base de données, sélectionnez la bonne base de données (`USE transit_db;` par exemple), puis exécutez le contenu du script.

    *Note:* Le script SQL fourni contient des exemples de données `INSERT` commentés pour les tables de transport. La table `users` est initialisée avec un utilisateur `admin` (mot de passe: `secureAdminPassword123!`).

## Configuration de l'Authentification

L'authentification utilise des JSON Web Tokens (JWT). Une clé secrète est utilisée pour signer ces tokens. Par défaut, elle est définie dans `routes/auth.js` et `middleware/authMiddleware.js` (`votre_super_secret_jwt_ici_a_changer_en_production`).

**Important pour la production :** Vous DEVEZ changer cette clé secrète et la stocker de manière sécurisée, idéalement via une variable d'environnement `JWT_SECRET`.

## Lancer l'API

Une fois l'installation et la configuration terminées, vous pouvez démarrer le serveur API :

```bash
npm start
```

Si vous n'avez pas de script `start` dans votre `package.json` (ou si vous préférez), vous pouvez utiliser :

```bash
node server.js
```

Le serveur devrait démarrer et afficher un message comme `Server running on port 3000. API docs at http://localhost:3000/api-docs` (ou un autre port si configuré via la variable d'environnement `PORT`).

## Utilisation de l'API et Authentification

Toutes les routes CRUD (`/locations`, `/modes`, `/lines`, `/stops`) sont désormais protégées et nécessitent un token JWT valide.

### 1. Obtenir un Token JWT

Pour obtenir un token, envoyez une requête `POST` à la route `/api/v1/auth/login` avec le nom d'utilisateur et le mot de passe dans le corps de la requête (format JSON).

**Utilisateur par défaut :**
*   Username: `admin`
*   Password: `secureAdminPassword123!`

**Exemple de requête (avec `curl` ou Postman) :**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "secureAdminPassword123!"}'
```

**Réponse attendue (succès) :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTYxOTgwNjY0NSwiZXhwIjoxNjE5ODA5NjQ1fQ.xxxxxxxxxxxx",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```
Copiez la valeur du champ `token`.

### 2. Accéder aux Routes Protégées

Pour chaque requête vers une route protégée, vous devez inclure le token JWT dans l'en-tête `Authorization` avec le préfixe `Bearer`.

**Format de l'en-tête :** `Authorization: Bearer VOTRE_TOKEN_JWT`

#### a. Utilisation avec Swagger UI

1.  Accédez à la documentation Swagger : [http://localhost:3000/api-docs](http://localhost:3000/api-docs).
2.  Cliquez sur le bouton vert "Authorize" en haut à droite.
3.  Dans la fenêtre modale, sous `bearerAuth (http, Bearer)`, collez votre token JWT complet (y compris le préfixe `Bearer ` si ce n'est pas déjà fait par l'interface, ou juste le token si l'interface ajoute `Bearer ` pour vous. Généralement, collez `Bearer VOTRE_TOKEN_JWT`).
4.  Cliquez sur "Authorize", puis "Close".
5.  Vous pouvez maintenant tester les routes protégées. Swagger ajoutera automatiquement l'en-tête `Authorization`.

#### b. Utilisation avec Postman (ou similaire)

1.  Créez une nouvelle requête (par exemple, `GET /api/v1/locations`).
2.  Allez dans l'onglet "Authorization".
3.  Sélectionnez le type "Bearer Token".
4.  Collez votre token JWT (sans le préfixe `Bearer `) dans le champ "Token".
5.  Envoyez la requête.

    *Alternativement, dans l'onglet "Headers", ajoutez une clé `Authorization` avec la valeur `Bearer VOTRE_TOKEN_JWT`.*

#### c. Utilisation avec `fetch` dans un navigateur (JavaScript)
```javascript
fetch('http://localhost:3000/api/v1/locations', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer VOTRE_TOKEN_JWT',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erreur:', error));
```

### Gestion des Rôles

Actuellement, un utilisateur `admin` est créé par défaut. Le middleware `adminOnly` (dans `middleware/authMiddleware.js`) est disponible si vous souhaitez restreindre certaines routes spécifiquement aux administrateurs. Pour l'instant, toutes les routes CRUD sont accessibles à tout utilisateur authentifié, quel que soit son rôle (car seul `authMiddleware` est appliqué globalement).

## Documentation de l'API (Swagger)

L'API inclut une documentation interactive générée avec Swagger UI. Une fois le serveur lancé, vous pouvez accéder à cette documentation via votre navigateur à l'adresse suivante :

[http://localhost:3000/api-docs](http://localhost:3000/api-docs) (adaptez le port si vous l'avez modifié).

La documentation Swagger vous permet de visualiser tous les points de terminaison de l'API, leurs paramètres, les corps de requête attendus, les réponses possibles et même de tester directement les requêtes depuis votre navigateur (n'oubliez pas de vous authentifier comme décrit ci-dessus pour les routes protégées).

## Points de Terminaison de l'API (Endpoints)

L'API expose les endpoints suivants sous le préfixe `/api/v1`. Tous ces endpoints (sauf `/auth/login`) sont protégés et nécessitent une authentification JWT.

**Authentication (`/api/v1/auth`)**

*   `POST /login`: Connecte un utilisateur et retourne un token JWT (publique).

**Locations (`/api/v1/locations`)** (Protégé)

*   `GET /`: Récupérer toutes les localisations.
*   `GET /:id`: Récupérer une localisation par son ID.
*   `POST /`: Créer une nouvelle localisation.
*   `PUT /:id`: Mettre à jour une localisation existante.
*   `DELETE /:id`: Supprimer une localisation par son ID.

**Modes (`/api/v1/modes`)** (Protégé)

*   `GET /`: Récupérer tous les modes.
*   `GET /:id`: Récupérer un mode par son ID.
*   `POST /`: Créer un nouveau mode.
*   `PUT /:id`: Mettre à jour un mode existant.
*   `DELETE /:id`: Supprimer un mode par son ID.

**Lignes (`/api/v1/lines`)** (Protégé)

*   `GET /`: Récupérer toutes les lignes.
*   `GET /:id`: Récupérer une ligne par son ID.
*   `POST /`: Créer une nouvelle ligne.
*   `PUT /:id`: Mettre à jour une ligne existante.
*   `DELETE /:id`: Supprimer une ligne par son ID.

**Arrêts (`/api/v1/stops`)** (Protégé)

*   `GET /`: Récupérer tous les arrêts.
*   `GET /:id`: Récupérer un arrêt par son ID.
*   `POST /`: Créer un nouvel arrêt.
*   `PUT /:id`: Mettre à jour un arrêt existant.
*   `DELETE /:id`: Supprimer un arrêt par son ID.

## Fonctionnalités Supplémentaires (Potentielles)

*   **Gestion des utilisateurs:** Routes pour créer, mettre à jour, supprimer des utilisateurs (protégées par le rôle admin).
*   **Validation avancée:** Utiliser des bibliothèques comme `joi` ou `express-validator`.
*   **Pagination, Recherche/Filtrage** pour les listes.
*   **Endpoint d'optimisation de trajet.**

