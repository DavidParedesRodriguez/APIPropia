## APIPropia 

### Cómo Ejecutar la API Para ejecutar la API, sigue estos pasos:

1. Abre tu terminal y navega a la carpeta `~/APIPropia/nodo-express`. 

cd ~/APIPropia/nodo-express

1. Ejecuta el siguiente comando para iniciar la API.

npm run start

Esto ejecutará el comando node app.js. Para visualizar la API en tu navegador, utiliza la extensión "Go Live" en Visual Studio Code.

### Resumen del Proceso de Desarrollo
Configuración Inicial:

1. Se siguió la práctica "Build a REST API with Node.js SQLite and Express JS" para construir el servidor y la base de datos.
· La estructura básica del servidor y la base de datos se implementaron según la guía proporcionada.
· Formularios de Registro e Inicio de Sesión:

2. Se crearon formularios para los endpoints de registro e inicio de sesión.
· Se establecieron requisitos para los campos, como obligatoriedad y longitud mínima de contraseña.
· Se implementaron mensajes de ayuda para guiar al usuario durante el proceso.
· Habilitación de HTTPS:

3. Se intentó habilitar el protocolo HTTPS para mejorar la seguridad de la comunicación.
· A pesar de enfrentar problemas, se siguieron los pasos recomendados para la implementación segura de HTTPS.
· Cambio de Cifrado a SHA512:

4. Se realizó una actualización en el cifrado de contraseñas, pasando de MD5 a SHA512.
· Este cambio mejora la seguridad de las contraseñas almacenadas en la base de datos.
· Agregación de Anotaciones:

5. Se implementó la funcionalidad para agregar anotaciones a los usuarios después de iniciar sesión.
· Al iniciar sesión, se abre una nueva ventana que permite al usuario ingresar anotaciones relacionadas con su cuenta.

### Estructura del Proyecto

El proyecto consta de varios archivos que colaboran para crear una aplicación web con funcionalidades de registro, inicio de sesión y gestión de anotaciones asociadas a usuarios específicos.

Archivos Principales

1. **server.js**: Archivo principal del servidor que utiliza Express para crear servidores HTTP y HTTPS. Define rutas para la API, configura la base de datos SQLite y maneja operaciones de registro, inicio de sesión y anotaciones.

2. **database.js**: Configuración de la base de datos SQLite, creando tablas para usuarios y anotaciones.
3. **registro.js**: Lógica de registro de nuevos usuarios, haciendo solicitudes a la API para verificar y agregar usuarios a la base de datos.
4. **registro.html**: Formulario de registro con campos para nombre, correo electrónico, contraseña y anotaciones.
5. **login.js**: Lógica para iniciar sesión con credenciales, haciendo solicitudes a la API para autenticar a los usuarios.
6. **login.html**: Formulario de inicio de sesión con campos para correo electrónico y contraseña.
7. **index.html**: Página principal que proporciona enlaces a las páginas de registro e inicio de sesión.
8. **notaciones.js**: Este archivo proporciona la lógica para agregar anotaciones a un usuario específico.
9. **notaciones.html**: Este archivo contiene la estructura HTML y los estilos asociados a la página de "Agregar Anotaciones".

Los archivos **notaciones.html y notaciones.js** Estos archivos trabajan en conjunto para proporcionar la funcionalidad de agregar anotaciones, recuperando el user\_id de la URL y haciendo solicitudes a la API. La página está diseñada para ser visualmente coherente con el estilo general del proyecto.

* Estilos Compartidos: Se compartieron estilos CSS entre las páginas login.html y notaciones.html para mantener una apariencia coherente.


### Librerías Utilizadas

* Express.js: Framework web para Node.js que facilita la creación de aplicaciones web y API.
* SQLite: Base de datos incorporada en el proyecto para almacenar información de usuarios y anotaciones.
* Fetch API: Utilizada en los archivos registro.js, login.js, y notaciones.js para realizar solicitudes HTTP a la API.
* MD5: Utilizado para realizar el hash de las contraseñas antes de almacenarlas en la base de datos.



