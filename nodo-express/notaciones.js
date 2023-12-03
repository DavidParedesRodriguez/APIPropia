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

    
    console.log('Nueva fila en user_annotations:', data.data);

   
  })
  .catch(error => {
    console.error(error.message);
   
  });
}


function obtenerUserIdDesdeUrl() {
  const urlParametros = new URLSearchParams(window.location.search);
  return urlParametros.get('userId') || 0;
}