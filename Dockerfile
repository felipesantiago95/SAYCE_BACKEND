# Usar una imagen base optimizada
FROM node:16

# Configurar directorio de trabajo
WORKDIR /app

# Asegurar que se usará un usuario no root para mayor seguridad
RUN useradd --create-home --shell /bin/bash appuser
USER appuser

# Copiar solo los archivos necesarios para la instalación de dependencias
COPY package*.json ./

# Instalar dependencias sin copiar `node_modules` desde el host
RUN npm install --force && npm rebuild bcrypt --build-from-source

# Copiar el resto del código fuente después de instalar dependencias
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
