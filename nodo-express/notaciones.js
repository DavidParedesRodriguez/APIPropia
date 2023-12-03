// Obtén el userId de la URL
const userId = obtenerUserIdDesdeUrl();

function agregarAnotaciones() {
  const nuevasAnotaciones = document.getElementById('nuevasAnotaciones').value;

  fetch(`http://localhost:8000/api/userAnnotations/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token'),
    },
    body: JSON.stringify({ user_id: userId, annotation: nuevasAnotaciones }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Nuevas anotaciones agregadas:', data);

    // Añadir la nueva fila a tu interfaz, por ejemplo, mostrándola en la consola
    console.log('Nueva fila en user_annotations:', data.data);

    // Puedes agregar lógica para mostrar la nueva fila en tu interfaz
  })
  .catch(error => {
    console.error(error.message);
    // Maneja errores, si es necesario
  });
}

// Función para obtener el userId de la URL
function obtenerUserIdDesdeUrl() {
  // Obtén la parte de la URL después del último "="
  const urlParametros = new URLSearchParams(window.location.search);
  return urlParametros.get('userId') || 0;
}