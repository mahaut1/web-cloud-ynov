# Web Cloud Ynov - Projet individuel

Application React Native développée avec Expo et Expo Router dans le cadre du TP **Livrable 1 : Socle Technique & Déploiement Continu**.

## Lien de l'application déployée

Application web déployée sur GitHub Pages :  
https://mahaut1.github.io/web-cloud-ynov

## Objectif du projet

L'objectif est de créer une application Expo avec :

- une navigation entre les pages principales ;
- une authentification Firebase multi-méthodes ;
- une page profil protégée ;
- un pipeline CI/CD avec GitHub Actions ;
- un déploiement web sur GitHub Pages ;
- un build mobile via EAS.

## Technologies utilisées

- React Native
- Expo
- Expo Router
- Firebase Authentication
- GitHub Actions
- GitHub Pages
- EAS Build

## Fonctionnalités réalisées

### Navigation

L'application contient les pages suivantes :

- Accueil
- Connexion
- Inscription
- Profil

Une navigation permet d'accéder aux différentes pages de l'application.

### Authentification Firebase

Les méthodes de connexion suivantes sont implémentées :

- Email / mot de passe
- Téléphone avec OTP
- GitHub
- Facebook
- Connexion anonyme

Après une connexion ou une inscription réussie, l'utilisateur est automatiquement redirigé vers la page Profil.

Après une déconnexion, l'utilisateur est redirigé vers la page Connexion.

### Page Profil

La page Profil affiche le texte demandé :

> Ici s'affichera prochainement votre profil

Elle contient également un bouton de déconnexion.

### CI/CD et déploiement

Un workflow GitHub Actions est configuré pour :

- installer les dépendances ;
- builder l'application web ;
- déployer l'application sur GitHub Pages ;
- lancer un build Android avec EAS.

## Installation du projet

```bash
npm install

## Lancer le projet en local
npx expo start

##Lancer la version web
npx expo start --web

##Build web
npm run predeploy

##Déploiement
Le déploiement est automatisé avec GitHub Actions à chaque push sur la branche master.

##Preuve EAS
![Build EAS réussi](./assets/eas-success.png)

## Repository GitHub
https://github.com/mahaut1/web-cloud-ynov



```
