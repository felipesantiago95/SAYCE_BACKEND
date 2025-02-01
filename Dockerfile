# Usar una imagen base optimizada
FROM node:16

# Configurar directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios para la instalación de dependencias
COPY package*.json ./

# Instalar dependencias sin copiar `node_modules` desde el host
RUN npm install 
RUN npm install bcrypt
RUN npm rebuild 

# Copiar el resto del código fuente después de instalar dependencias
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
