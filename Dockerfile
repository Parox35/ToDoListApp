# Utiliser une image de base officielle Node.js
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le code source de l'application
COPY . .

# Installer les dépendances de construction pour les modules natifs
RUN apt-get update && apt-get install -y python3 make g++

# Installer les dépendances de l'application
RUN npm install

# Exposer le port sur lequel l'application va tourner
EXPOSE 3000

# Commande pour démarrer l'application
CMD [ "node", "server.js" ]
