# Prueba de concepto de un video juego: Tepuy 

Tepuy es un prototipo de videojuego basado en ![Carcassonne](https://en.wikipedia.org/wiki/Carcassonne_(board_game))

![Diagrama de arquitectura](Tepuy-overview.png)

El codigo esta dividido en: <br/><br/>
**Backend**: Despliegue automatico utilizando Docker Compose de dos contenedores Docker, uno con la base de datos NoSQL MongoDB y otro con las API basada en FastAPI en Python. <br/><br/>
**Frontend**: Instrucciones para ejecutar el codigo del prototipo usando React Native.<br/>

## **Pasos para instalar y ejecutar la aplicación**

### **1. Clonar el repositorio**
Clona el repositorio en tu máquina local:

git clone https://github.com/ruthbri/tepuy.git <br/>
cd tepuy <br/>

### **2. Inicia los contenedores con MongoDB y FastAPI**

cd backend <br/>
docker-compose up --build <br/>
Con esto crearas y ejecutas los contenedores para la API y la base de datos MongoDB

### **3. Restaurar los datos en la base de datos**

docker cp dump.archive mongodb_tepuy:/data/dump.archive <br/>
docker exec -i mongodb_tepuy mongorestore --archive=/data/dump.archive <br/>

### **4. Si quieres verificar que todo te salio bien**

Usando el navegador, visita esta URL: http://localhost:8000 <br/>
deberias ver un mensaje como este:
{"message":"Welcome to the FastAPI Game API"}

Comprueba los endpoints de la API: <br/>
http://localhost:8000/docs


