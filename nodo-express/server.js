const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const db = require("./database.js");
const crypto  = require("crypto");

const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const HTTP_PORT = 8000;
const HTTPS_PORT = 8443;

https.createServer({
  cert: fs.readFileSync('ca.crt'),
  key: fs.readFileSync('ca.key')
},app).listen(HTTPS_PORT, function(){
 console.log('Servidor https correindo en el puerto 443');
});

app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

app.get("/", (req, res, next) => {
  res.json({ message: "Ok" });
});

app.get("/api/users", (req, res, next) => {
  const sql = "SELECT * FROM user";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

app.get("/api/user/:id", (req, res, next) => {
  const sql = "SELECT * FROM user WHERE id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

app.post("/api/user/", (req, res, next) => {
  var errors = []
  if (!req.body.password){
      errors.push("No password specified");
  }
  if (!req.body.email){
      errors.push("No email specified");
  }
  if (errors.length){
      res.status(400).json({"error":errors.join(",")});
      return;
  }
  var data = {
      name: req.body.name,
      email: req.body.email,
      password : hashPassword(req.body.password)  // Usa la función hashPassword
  }
  var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
  var params =[data.name, data.email, data.password]
  db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      });
  });
});

app.get("/api/userLogin/:email/:password", (req, res, next) => {
  const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
  const params = [req.params.email, hashPassword(req.params.password)];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

app.post("/api/login/", (req, res, next) => {
    var errors = [];

    if (!req.body.email || !req.body.password) {
        errors.push("Email y contraseña son obligatorios.");
    }

    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }

    var sql = "SELECT * FROM user WHERE email = ? AND password = ?";
    var params = [req.body.email, hashPassword(req.body.password)];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        if (!row) {
            res.status(401).json({ error: "Credenciales incorrectas." });
            return;
        }

        // Crear y enviar token
        const token = generarToken(row.id);
        res.json({
            message: "success",
            token: token,
            userId: row.id,
            name: row.name,  // Agrega el nombre del usuario
        });
    });
});

function hashPassword(password) {
  const sha512 = crypto.createHash('sha512');
  const hashedPassword = sha512.update(password).digest('hex');
  return hashedPassword;
}

app.get("/ruta-segura", verificarToken, (req, res, next) => {
    // Tu lógica segura aquí
    res.json({ message: "Ruta segura." });
});

// Función para generar un token
function generarToken(userId) {
    // Implementa lógica para generar un token (puedes usar bibliotecas como jsonwebtoken)
    // Aquí hay un ejemplo simple:
    const token = userId.toString();  // Puedes usar bibliotecas más robustas para esto
    return token;
}

function verificarToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        res.status(401).json({ error: "Acceso no autorizado. Token no proporcionado." });
        return;
    }

    jwt.verify(token, 'tu_secreto_secreto', (err, decoded) => {
        if (err) {
            res.status(401).json({ error: "Token inválido." });
            return;
        }

        req.userId = decoded.userId;
        next();
    });
}


// Aplicar middleware a las rutas que requieran autenticación
app.get("/ruta-segura", verificarToken, (req, res, next) => {
    // Tu lógica segura aquí
    res.json({ message: "Ruta segura." });
});

