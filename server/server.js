const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());

// Ruta para manejar la ubicación del usuario
app.post('/submit-location', (req, res) => {
    const { latitude, longitude } = req.body;
    const locationData = `Latitud: ${latitude}, Longitud: ${longitude}\n`;

    fs.appendFile(path.join(__dirname, '..', 'locations.txt'), locationData, (err) => {
        if (err) {
            console.error('Error al guardar la ubicación:', err);
            res.status(500).send('Error al guardar la ubicación');
        } else {
            res.send('Ubicación guardada');
        }
    });
});

app.get('/admin', (req, res) => {
    fs.readFile(path.join(__dirname, '..', 'locations.txt'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo de ubicaciones');
            return;
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

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
