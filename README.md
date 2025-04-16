# Projet Tweet Académie (Groupe:LIDL)

styven.raya@epitech.eu (THE GREATEST)
anthony-steven.tea@epitech.eu
christopher.desous@epitech.eu
antoine.thellier@epitech.eu 

Ce projet a pour objectif de créer une plateforme de réseau social similaire à Twitter, permettant aux étudiants de se connecter et d'interagir entre eux. Le système comportera une base de données commune, une interface utilisateur interactive et diverses fonctionnalités permettant une expérience utilisateur dynamique.

## Compétences à Acquérir
- **Fetch** 
- **Micro-frameworks CSS**
- **Base de données relationnelle**
- **Web Socket**
- **Node.js**
- **Express**


## 1. Base de Données

### Schéma Relationnel
Le projet repose sur une base de données relationnelle commune. Il est impératif que chaque groupe utilise le même schéma de base de données pour garantir une intégration cohérente entre les différentes parties du projet.

- Chaque groupe devra établir et partager le schéma relationnel de la base de données.
- La structure de la base de données doit être identique pour tous les groupes afin de maintenir la cohérence.
- Le fichier `twitter.sql` contenant la structure de la base de données doit être placé à la racine du dossier de rendu.

**Note importante :**
Si vous n'utilisez pas la même structure de base de données que les autres groupes, votre note finale sera divisée par deux.

## 2. Fonctionnalités

Le projet doit intégrer les principales fonctionnalités d'un réseau social de type Twitter. Voici la liste des fonctionnalités à implémenter :

- **Compte membre** : Création et gestion de comptes utilisateurs.
- **Tweets** : 
  - Ajout de hashtags (`#`) dans les tweets.
  - Mention d'une personne que vous suivez dans un tweet (avec `@`).
  - Répondre à un tweet.
  - Retweeter.
- **Recherche** : Section pour rechercher des tags (#).
- **Suivi d'un membre** : Fonction pour suivre un autre utilisateur.
- **Thème** : Choix du thème d'affichage.
- **Liste des followers et des followings** : Affichage des utilisateurs qui vous suivent et des utilisateurs que vous suivez.
- **Timeline** : La timeline devra se rafraîchir automatiquement pour afficher les derniers tweets.
- **Édition du profil** : Possibilité de modifier son profil utilisateur.
- **Messagerie privée** : Implémentation d'un système de messagerie privée.
- **Limite de caractères** : Les tweets ne doivent pas dépasser 140 caractères.

## 3. Authentification

Pour assurer la sécurité des mots de passe des utilisateurs :

- Les mots de passe **ne doivent pas être stockés en clair** dans la base de données.
- Utilisez un algorithme de hachage sécurisé, à savoir **RIPEMD-160**, pour le stockage des mots de passe.
- Le **salt commun** à tous les groupes sera : `vive le projet tweet_academy`.

## Structure du Projet

##  1.Trello

Pour mener ce projet à bon terme nous avons utiliser l'outil de gestion de projet Trello afin de décrire chaque étape du projet & les assigners aux membres du groupe.

##  2.Figma 

Pour la partie design du projet nous avons utiliser Figma qui est un éditeur de graphiques vectoriels et un outil de prototypage pour préparer premièrement notre maquette, designer notre logo, thème du site et tout réorganiser afin d'avoir un rendu final du site qu'on a imaginé.

## 3.Websocket 

Pour la messagerie privé nous nous sommes tourner vers la librairie socket.io pour permettre une connection continue entre le serveur & le client afin d'éviter d'overload le serveur de requête .

npm install socket.io


## 4.Tailwind CSS

## 5. Gestion des médias 

Utilisation de PHP & JavaScript 


## 6.Fetch