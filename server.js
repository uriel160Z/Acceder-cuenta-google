const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(bodyParser.json());

// Ruta para manejar la ubicación del usuario
app.post('/submit-location', (req, res) => {
    const { latitude, longitude } = req.body;

    // Validar la latitud y longitud
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).send('Datos de ubicación inválidos');
    }

    // Formato de datos de ubicación
    const locationData = `Latitud: ${latitude}, Longitud: ${longitude}\n`;

    // Guardar los datos en el archivo 'locations.txt'
    fs.appendFile(path.join(__dirname, 'locations.txt'), locationData, (err) => {
        if (err) {
            console.error('Error al guardar la ubicación:', err);
            return res.status(500).send('Error al guardar la ubicación');
        }
        res.send('Ubicación guardada');
    });
});

// Ruta para mostrar las ubicaciones guardadas en formato HTML
app.get('/admin', (req, res) => {
    fs.readFile(path.join(__dirname, 'locations.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de ubicaciones:', err);
            return res.status(500).send('Error al leer el archivo de ubicaciones');
        }
        res.send(`
            <html>
                <head><title>Ubicaciones de Usuarios</title></head>
                <body>
                    <h1>Ubicaciones de Usuarios</h1>
                    <pre>${data}</pre>
                </body>
            </html>
        `);
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
