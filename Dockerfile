# Image Node officielle
FROM node:20-alpine

# Dossier de travail dans le container
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Lancer Vite
CMD ["npm", "run", "dev", "--", "--host"]
