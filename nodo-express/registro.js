function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;
    const anotacion = document.getElementById('anotaciones').value; // Agregamos la anotación

    if (!nombre || !email || !contrasena || !confirmarContrasena) {
        mostrarError("Todos los campos son obligatorios.");
        return;
    }

    if (contrasena.length < 8) {
        mostrarError("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    if (contrasena !== confirmarContrasena) {
        mostrarError("Las contraseñas no coinciden.");
        return;
    }

    const userData = {
        name: nombre,
        email: email,
        password: contrasena,
        annotations: anotacion, // Agrega las anotaciones al objeto userData
    };

    fetch('http://localhost:8000/api/user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);

        // Almacena el token en localStorage
        localStorage.setItem('token', data.token);

        // Asegurarte de que las rutas seguras usen el token
        fetch('http://localhost:8000/ruta-segura', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token'),
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor (Ruta segura):', data);
            localStorage.setItem('token', data.token);

            // Puedes manejar la respuesta de la ruta segura aquí
        })
        .catch(error => {
            console.error(error.message);
            mostrarError("Error al conectar con la API (Ruta segura)");
        });

        // Llamada para agregar anotaciones después de registrar al usuario
        agregarAnotaciones(data.id, anotacion);
        
        // Puedes redirigir o realizar otras acciones después del registro
    })
    .catch(error => {
        console.error(error.message);
        mostrarError("Error al conectar con la API");
    });
}

// Función para agregar anotaciones
function agregarAnotaciones(userId, anotacion) {
    fetch(`http://localhost:8000/api/userAnnotations/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ user_id: userId, annotation: anotacion }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Anotaciones agregadas:', data);
        // Puedes realizar acciones adicionales después de agregar las anotaciones
    })
    .catch(error => {
        console.error(error.message);
        // Manejar errores, si es necesario
    });
}

function mostrarError(mensaje) {
    document.getElementById('mensajeError').innerText = mensaje;
}