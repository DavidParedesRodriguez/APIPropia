document.addEventListener('DOMContentLoaded', function () {
    mostrarMensajeBienvenida();
});

function mostrarMensajeBienvenida() {
    const usuario = obtenerNombreUsuarioLocalStorage(); 
    const mensaje = `¡Hola, ${usuario}! Has iniciado sesión correctamente.`;
    document.getElementById('mensajeBienvenida').textContent = mensaje;
}

function obtenerNombreUsuarioLocalStorage() {
    return localStorage.getItem('usuario') || 'Invitado';
}

function cerrarSesion() {
    window.location.href = 'index.html'; 
}