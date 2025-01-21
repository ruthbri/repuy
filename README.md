# Tepuy API

Tepuy API es una aplicación desarrollada con **FastAPI** y **MongoDB** para gestionar un sistema de juego con salas, jugadores y tiles.

## **Pasos para instalar y ejecutar la aplicación**

### **1. Clonar el repositorio**
Clona el repositorio en tu máquina local:

git clone https://github.com/ruthbri/repuy.git
cd repuy

### **2. Inicia los contenedore**

docker-compose up --build
Con esto crearas y ejecutas los contenedores para la API y la base de datos MongoDB

### **3. Restaurar los datos en la base de datos**

docker cp dump.archive mongodb_tepuy:/data/dump.archive
docker exec -i mongodb_tepuy mongorestore --archive=/data/dump.archive

### **4. Si quieres verificar que todo te salio bien**
Coloca en el navegador: http://localhost:8000
deberias ver un mensaje como este:
{"message":"Welcome to the FastAPI Game API"}


