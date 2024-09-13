function getLocation() {
    const locationDiv = document.getElementById("location");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendPosition, showError);
    } else {
        locationDiv.innerHTML = "La geolocalización no es compatible con este navegador.";
    }
}

function sendPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const locationDiv = document.getElementById("location");

    locationDiv.innerHTML = `
        <h3>Tu ubicación actual es:</h3>
        <p>Latitud: ${latitude}</p>
        <p>Longitud: ${longitude}</p>
        <iframe 
            width="100%" 
            height="300" 
            src="https://www.google.com/maps?q=${latitude},${longitude}&output=embed"
            frameborder="0" allowfullscreen>
        </iframe>
    `;

    // Enviar la ubicación al servidor
    fetch('/submit-location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latitude, longitude })
    });
}

function showError(error) {
    const locationDiv = document.getElementById("location");
    switch(error.code) {
        case error.PERMISSION_DENIED:
            locationDiv.innerHTML = "El usuario negó la solicitud de geolocalización.";
            break;
        case error.POSITION_UNAVAILABLE:
            locationDiv.innerHTML = "La información de ubicación no está disponible.";
            break;
        case error.TIMEOUT:
            locationDiv.innerHTML = "La solicitud para obtener la ubicación ha expirado.";
            break;
        case error.UNKNOWN_ERROR:
            locationDiv.innerHTML = "Se ha producido un error desconocido.";
            break;
    }
}
