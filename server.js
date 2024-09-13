const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());

// Ruta para manejar la ubicación del usuario
app.post('/submit-location', (req, res, next) => {
    const { latitude, longitude } = req.body;
    const locationData = `Latitud: ${latitude}, Longitud: ${longitude}\n`;

    fs.appendFile(path.join(__dirname, 'locations.txt'), locationData, (err) => {
        if (err) {
            console.error('Error al guardar la ubicación:', err);
            return next(err); // Pasar el error al middleware de manejo de errores
        }
        res.send('Ubicación guardada');
    });
});

app.get('/admin', (req, res, next) => {
    fs.readFile(path.join(__dirname, 'locations.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de ubicaciones:', err);
            return next(err); // Pasar el error al middleware de manejo de errores
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

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack); // Mostrar el error en la consola
    res.status(500).send('Algo salió mal.'); // Responder con un mensaje genérico
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
