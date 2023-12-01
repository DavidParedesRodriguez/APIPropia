const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const db = require("./database.js");
const crypto = require("crypto");

const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const HTTP_PORT = 8000;
const HTTPS_PORT = 8443;

https
  .createServer(
    {
      cert: fs.readFileSync("ca.crt"),
      key: fs.readFileSync("ca.key"),
    },
    app
  )
  .listen(HTTPS_PORT, function () {
    console.log("Servidor https corriendo en el puerto 443");
  });

app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

// Crear tabla user_annotations si no existe
db.run(
  `CREATE TABLE IF NOT EXISTS user_annotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      annotation TEXT,
      FOREIGN KEY (user_id) REFERENCES user (id)
  )`,
  (err) => {
    if (err) {
      console.error("Error creating user_annotations table:", err.message);
    } else {
      console.log("User annotations table created successfully.");
    }
  }
);

// Crear tabla user si no existe
db.run(
  `CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      annotations TEXT,
      CONSTRAINT email_unique UNIQUE (email)
  )`,
  (err) => {
    if (err) {
      console.error("Error creating user table:", err.message);
    } else {
      console.log("User table created successfully.");
    }
  }
);

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

// Nuevo endpoint para obtener anotaciones de un usuario específico
app.get("/api/userAnnotations/:id", (req, res, next) => {
  const sql = "SELECT annotation FROM user_annotations WHERE user_id = ?";
  const params = [req.params.id];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      annotations: rows,
    });
  });
});

// Nuevo endpoint para agregar anotaciones a un usuario específico
app.post("/api/userAnnotations/:id", (req, res, next) => {
  const userId = req.params.id;
  const { annotation } = req.body;

  const sql = "INSERT INTO user_annotations (user_id, annotation) VALUES (?, ?)";
  const params = [userId, annotation];

  db.run(sql, params, function (err, result) {
      if (err) {
          res.status(400).json({ error: err.message });
          return;
      }
      res.json({
          message: "success",
          affectedRows: this.changes,
      });
  });
});

app.post("/api/user/", (req, res, next) => {
  var errors = [];
  if (!req.body.password) {
      errors.push("No password specified");
  }
  if (!req.body.email) {
      errors.push("No email specified");
  }
  if (errors.length) {
      res.status(400).json({ "error": errors.join(",") });
      return;
  }

  // Verificar si el correo electrónico ya está en uso
  const checkEmailSql = "SELECT * FROM user WHERE email = ?";
  const checkEmailParams = [req.body.email];

  db.get(checkEmailSql, checkEmailParams, (checkEmailErr, checkEmailRow) => {
      if (checkEmailErr) {
          res.status(500).json({ "error": checkEmailErr.message });
          return;
      }

      if (checkEmailRow) {
          // El correo electrónico ya está en uso
          res.status(400).json({ "error": "Email already in use" });
          return;
      }

      // El correo electrónico no está en uso, procede con la inserción
      var data = {
          name: req.body.name,
          email: req.body.email,
          password: hashPassword(req.body.password)
      };

      var insertSql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)';
      var insertParams = [data.name, data.email, data.password];

      db.run(insertSql, insertParams, function (insertErr, result) {
          if (insertErr) {
              res.status(400).json({ "error": insertErr.message });
              return;
          }
          res.json({
              "message": "success",
              "data": data,
              "id": this.lastID
          });
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
            name: row.name,  
        });
    });
});

function hashPassword(password) {
  const sha512 = crypto.createHash('sha512');
  const hashedPassword = sha512.update(password).digest('hex');
  return hashedPassword;
}

app.get("/ruta-segura", verificarToken, (req, res, next) => {
    
    res.json({ message: "Ruta segura." });
});

// Función para generar un token
function generarToken(userId) {
    const token = userId.toString();  
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
    res.json({ message: "Ruta segura." });
});

