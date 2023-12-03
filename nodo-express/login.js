function iniciarSesion() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (!email || !password) {
        mostrarError("Email y contraseña son obligatorios.");
        return;
    }

    var userData = {
        email: email,
        password: password
    };

    fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.status === 401) {
            throw new Error("Credenciales incorrectas.");
        }

        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        return response.json();
    })
    .then(data => {
        // Abre otra ventana o pestaña para agregar anotaciones
        const userId = data.userId;  // Asegúrate de que esta propiedad sea la correcta en tu respuesta
        const nuevaVentana = window.open(`notaciones.html?userId=${userId}`, '_blank');
      
       
    })
    .catch(error => {
        if (error.message.includes("Credenciales incorrectas.")) {
            mostrarError("Correo electrónico o contraseña incorrectos. Verifica tus credenciales e intenta nuevamente.");
        } else {
            console.error(error);
            mostrarError("Error al conectar con la API");
        }
    });
}

function mostrarError(mensaje) {
    document.getElementById('mensajeError').innerText = mensaje;
}

function mostrarMensajeBienvenida(nombreUsuario) {
    document.getElementById('mensajeBienvenida').innerText = `Bienvenido, ${nombreUsuario}!`;
    
}

