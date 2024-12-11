const express = require('express');
const mqtt = require('mqtt');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = 3005;

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Conexión a un broker MQTT (puedes usar uno público o tu propio broker)
const mqttClient = mqtt.connect('mqtt://test.mosquitto.org');

// Se suscribe a un tema
mqttClient.on('connect', () => {
  console.log('Conectado al broker MQTT');
  mqttClient.subscribe('mqtt-hola-mundo', (err) => {
    if (err) {
      console.log('Error al suscribirse al tema');
    }
  });
});

// Maneja los mensajes recibidos
mqttClient.on('message', (topic, message) => {
  console.log(`Mensaje recibido en el tema ${topic}: ${message.toString()}`);
});

// Ruta para enviar un mensaje MQTT
app.get('/send-message', (req, res) => {
  const message = 'Hola Mundo desde MQTT';
  mqttClient.publish('mqtt-hola-mundo', message, () => {
    res.send(`Mensaje enviado: ${message}`);
  });
});

// Ruta de prueba para verificar si el servidor está funcionando
app.get('/hello', (req, res) => {
  res.send('Hola Mundo desde el servidor MQTT');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
