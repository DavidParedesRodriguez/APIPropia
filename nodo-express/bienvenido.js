document.addEventListener('DOMContentLoaded', function () {
    mostrarMensajeBienvenida();
});

function mostrarMensajeBienvenida() {
    const usuario = obtenerNombreUsuarioLocalStorage(); // Cambia el nombre de la función según donde almacenes el nombre
    const mensaje = `¡Hola, ${usuario}! Has iniciado sesión correctamente.`;
    document.getElementById('mensajeBienvenida').textContent = mensaje;
}

function obtenerNombreUsuarioLocalStorage() {
    // Implementa la lógica para obtener el nombre de usuario desde localStorage
    // Por ejemplo, si almacenaste el nombre de usuario con la clave 'usuario':
    return localStorage.getItem('usuario') || 'Invitado'; // Si no se encuentra, devuelve 'Invitado' o el valor por defecto que prefieras
}

function cerrarSesion() {
    // Implementa la lógica para cerrar sesión
    // Puede ser eliminar el token, limpiar localStorage, etc.
    // Después redirige al usuario a la página de inicio de sesión o a otra página.
    // Ejemplo:
    window.location.href = 'index.html'; // Redirige a la página de inicio de sesión
}