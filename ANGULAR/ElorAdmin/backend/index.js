const express = require('express');
const cors = require('cors');

// prueba mysql, luego mysql2 y sino dice de instalarlo
let mysql;
try {
  mysql = require('mysql');
} catch (e) {
  try {
    mysql = require('mysql2');
  } catch (e2) {
    console.error("Falta dependencia 'mysql' o 'mysql2'. Instala con: npm install mysql2");
    process.exit(1);
  }
}
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200', // frontend angular
  credentials: true
}));
app.use(bodyParser.json());

// conexion mysql
const connection = mysql.createConnection({
  host: "10.5.104.144",
  user: "adminAngular",
  password: "12345",
  database: "elorbase",
  port: 3306
});

// manejar errores
connection.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err);
  } else {
    console.log("Conectado a la base de datos MySQL");
  }
});

const JWT_SECRET = 'elorrieta_secret_key_2025';

// endpoint de login
app.post('/api/auth/login', (req, res) => {
  const { email, pasahitza } = req.body;

  // validar que vengan los datos
  if (!email || !pasahitza) {
    return res.status(400).json({
      success: false,
      message: 'Email eta pasahitza beharrezkoak dira'
    });
  }

  // consulta para buscar el usuario por email
  const query = `
    SELECT *
    FROM users 
    WHERE email = ? 
    LIMIT 1
  `;

  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({
        success: false,
        message: 'Errorea datu-basean'
      });
    }

    // si no encuentra el usuario mandar error
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email edo pasahitza okerra'
      });
    }

    const user = results[0];

    // verifica la contraseña
    if (user.password !== pasahitza) {
      return res.status(401).json({
        success: false,
        message: 'Email edo pasahitza okerra'
      });
    }

    // elimina la contraseña del objeto usuario antes de enviarlo
    delete user.password;

    // genera el token jwt
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        tipo_id: user.tipo_id 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: user,
      token: token,
      message: 'Saioa hasita'
    });
  });
});

// middleware para verificar token jwt opcional para rutas protegidas
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Token ez da eman'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Token baliogabea edo iraungita'
      });
    }
    req.userId = decoded.id;
    req.userTipoId = decoded.tipo_id;
    next();
  });
}

// ejemplo de ruta protegida
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Baliabide babestua',
    userId: req.userId
  });
});

// endpoint para obtener estadisticas de usuarios
app.get('/api/users/stats/counts', verifyToken, (req, res) => {
  const query = `
    SELECT 
      SUM(CASE WHEN tipo_id = 4 THEN 1 ELSE 0 END) as ikasleak,
      SUM(CASE WHEN tipo_id = 3 THEN 1 ELSE 0 END) as irakasleak,
      SUM(CASE WHEN tipo_id IN (1, 2) THEN 1 ELSE 0 END) as adminak
    FROM users
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({
        success: false,
        message: 'Errorea estatistikak kargatzean'
      });
    }

    res.json({
      success: true,
      data: {
        ikasleak: parseInt(results[0].ikasleak) || 0,
        irakasleak: parseInt(results[0].irakasleak) || 0,
        adminak: parseInt(results[0].adminak) || 0
      }
    });
  });
});

// endpoint para obtener todos los usuarios 
app.get('/api/users', (req, res) => {
  const { tipo_id } = req.query;

  let query = `
    SELECT *
    FROM users
  `;

  const params = [];

  if (tipo_id) {
    query += ' WHERE tipo_id = ?';
    params.push(parseInt(tipo_id));
  }

  query += ' ORDER BY created_at DESC';

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({
        success: false,
        message: 'Errorea erabiltzaileak kargatzean'
      });
    }

    console.log(`${results.length} usuarios encontrados`);
    res.json({
      success: true,
      data: results
    });
  });
});

// endpoint para obtener un usuario por id 
app.get('/api/users/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT id, email, username, nombre, apellidos, dni, direccion, 
           telefono1, telefono2, tipo_id, argazkia_url, created_at 
    FROM users 
    WHERE id = ? 
    LIMIT 1
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({
        success: false,
        message: 'Errorea erabiltzailea kargatzean'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Erabiltzailea ez da aurkitu'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// endpoint para crear un nuevo usuario
app.post('/api/users', verifyToken, (req, res) => {
  const { email, izena, abizena, dni, helbidea, telefonoa1, telefonoa2, rola, argazkiaUrl } = req.body;

  if (!email || !izena || !abizena) {
    return res.status(400).json({
      success: false,
      message: 'Email, izena eta abizena beharrezkoak dira'
    });
  }

  // mapear rol a tipo_id
  let tipo_id = 4; // ikasle por defecto
  switch (rola) {
    case 'GOD': tipo_id = 1; break;
    case 'ADMIN': tipo_id = 2; break;
    case 'IRAKASLE': tipo_id = 3; break;
    case 'IKASLE': tipo_id = 4; break;
  }

  // constrseña por defecto
  const defaultPassword = '123456';

  const username = email;

  const query = `
    INSERT INTO users (email, username, password, nombre, apellidos, dni, 
                       direccion, telefono1, telefono2, tipo_id, argazkia_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    email,
    username,
    defaultPassword,
    izena,
    abizena,
    dni || null,
    helbidea || null,
    telefonoa1 || null,
    telefonoa2 || null,
    tipo_id,
    argazkiaUrl || 'avatarLehenetsia.jpg'
  ];

  connection.query(query, params, (err, result) => {
    if (err) {
      console.error('Error al crear usuario:', err);
      return res.status(500).json({
        success: false,
        message: 'Errorea erabiltzailea sortzean'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Erabiltzailea ondo sortu da',
      data: {
        id: result.insertId,
        email,
        nombre: izena,
        apellidos: abizena
      }
    });
  });
});

// BORRAR USUARIOS
app.delete('/api/users/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      return res.status(500).json({
        success: false,
        message: 'Errorea erabiltzailea ezabatzean'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Erabiltzailea ez da aurkitu'
      });
    }

    res.json({
      success: true,
      message: 'Erabiltzailea ondo ezabatu da'
    });
  });
});

// ACTUALIZAR USUARIOS
app.put('/api/users/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { email, izena, abizena, dni, helbidea, telefonoa1, telefonoa2, rola, argazkiaUrl, pasahitza } = req.body;

  // construir la query dinamicamente
  let updateFields = [];
  let params = [];

  if (email !== undefined) {
    updateFields.push('email = ?');
    params.push(email);
  }
  if (izena !== undefined) {
    updateFields.push('nombre = ?');
    params.push(izena);
  }
  if (abizena !== undefined) {
    updateFields.push('apellidos = ?');
    params.push(abizena);
  }
  if (dni !== undefined) {
    updateFields.push('dni = ?');
    params.push(dni);
  }
  if (helbidea !== undefined) {
    updateFields.push('direccion = ?');
    params.push(helbidea);
  }
  if (telefonoa1 !== undefined) {
    updateFields.push('telefono1 = ?');
    params.push(telefonoa1);
  }
  if (telefonoa2 !== undefined) {
    updateFields.push('telefono2 = ?');
    params.push(telefonoa2);
  }
  if (rola !== undefined) {
    let tipo_id = 4;
    switch (rola) {
      case 'GOD': tipo_id = 1; break;
      case 'ADMIN': tipo_id = 2; break;
      case 'IRAKASLE': tipo_id = 3; break;
      case 'IKASLE': tipo_id = 4; break;
    }
    updateFields.push('tipo_id = ?');
    params.push(tipo_id);
  }
  if (argazkiaUrl !== undefined) {
    updateFields.push('argazkia_url = ?');
    params.push(argazkiaUrl);
  }
  if (pasahitza !== undefined && pasahitza !== '') {
    updateFields.push('password = ?');
    params.push(pasahitza);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Ez dago eguneratzeko daturik'
    });
  }

  params.push(id);

  const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

  connection.query(query, params, (err, result) => {
    if (err) {
      console.error('Error al actualizar usuario:', err);
      return res.status(500).json({
        success: false,
        message: 'Errorea erabiltzailea eguneratzean',
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Erabiltzailea ez da aurkitu'
      });
    }

    const selectQuery = 'SELECT * FROM users WHERE id = ?';
    connection.query(selectQuery, [id], (err, users) => {
      if (err || users.length === 0) {
        return res.json({
          success: true,
          message: 'Erabiltzailea ondo eguneratu da',
          data: { id }
        });
      }

      res.json({
        success: true,
        message: 'Erabiltzailea ondo eguneratu da',
        data: users[0]
      });
    });
  });
});

  
// endpoint para obtener todas las reuniones
app.get('/api/bilerak', verifyToken, (req, res) => {

  const query = `SELECT * FROM reuniones ORDER BY fecha DESC`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener reuniones:', err);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las reuniones',
        error: err.message
      });
    }

    console.log(`Reuniones obtenidas: ${results.length}`);
    res.json({
      success: true,
      data: results
    });
  });
});


// endpoint para buscar reunion por id y ver los datos
app.get('/api/bilerak/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  console.log('GET /api/bilerak/:id - Buscando reunión con ID:', id);

  const query = 'SELECT * FROM reuniones WHERE id_reunion = ? LIMIT 1';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener reunión:', err);
      return res.status(500).json({
        success: false,
        message: 'Errorea bilera lortzean',
        error: err.message
      });
    }

    if (results.length === 0) {
      console.log('No se encontró reunión con ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Ez da bilera aurkitu'
      });
    }

    const reunion = results[0];
    
    console.log('Reunión encontrada en BD:', reunion);

    // formatear fecha y hora 
    let hasieraOrdua = null;
    if (reunion.fecha) {
      const fecha = new Date(reunion.fecha);
      hasieraOrdua = fecha.toTimeString().substring(0, 5); // hh:mm
    }

    // mapear los datos de la BD a la respuesta
    const response = {
      success: true,
      data: {
        id: reunion.id_reunion,
        titulua: reunion.titulo,
        azalpena: reunion.asunto,
        data: reunion.fecha,
        hasieraOrdua: hasieraOrdua,
        amaieraOrdua: null,
        egoera: reunion.estado,
        irakasleId: reunion.profesor_id,
        ikasleId: reunion.alumno_id,
        ikastetxeId: reunion.id_centro,
        gela: reunion.aula,
        sortzeData: reunion.created_at,
        eguneratzeData: reunion.updated_at
      }
    };

    res.json(response);
  });
});

// endpoint para crear una reunion
app.post('/api/bilerak', verifyToken, (req, res) => {
  const { titulua, azalpena, data, hasieraOrdua, ikastetxeId, gela, irakasleId, ikasleId, egoera } = req.body;

  if (!titulua || !data || !ikastetxeId) {
    return res.status(400).json({
      success: false,
      message: 'Titulua, data eta ikastetxeId beharrezkoak dira',
      received: { titulua, data, ikastetxeId }
    });
  }

  // combinar fecha y hora
  let fechaCompleta = data;
  if (hasieraOrdua) {
    const [year, month, day] = data.split('T')[0].split('-');
    fechaCompleta = `${year}-${month}-${day} ${hasieraOrdua}:00`;
  }

  const query = `
    INSERT INTO reuniones (titulo, asunto, fecha, estado, profesor_id, alumno_id, id_centro, aula)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    titulua,
    azalpena || null,
    fechaCompleta,
    egoera || 'pendiente',
    irakasleId || null,
    ikasleId || null,
    ikastetxeId,
    gela || null
  ];

  connection.query(query, params, (err, result) => {
    if (err) {
      console.error('Error al crear reunión:', err);
      return res.status(500).json({
        success: false,
        message: 'Errorea bilera sortzean',
        error: err.message
      });
    }

    console.log('Reunión creada con ID:', result.insertId);

    // devolver la reunion creada
    const selectQuery = 'SELECT * FROM reuniones WHERE id_reunion = ?';
    connection.query(selectQuery, [result.insertId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'Error al recuperar la reunión creada'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Bilera ondo sortu da',
        data: results[0]
      });
    });
  });
});

// endpoint para obtener centros desde htdocs
app.get('/api/ikastetxeak', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  // ruta al archivo JSON en htdocs (ajusta según tu instalación)
  const jsonPath = path.join('C:', 'xampp', 'htdocs', 'EuskadiLatLon.json');
  
  fs.readFile(jsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer EuskadiLatLon.json:', err);
      return res.status(500).json({
        success: false,
        message: 'Errorea zentroak kargatzean'
      });
    }

    try {
      const centros = JSON.parse(data);
      res.json({
        success: true,
        data: centros
      });
    } catch (parseErr) {
      console.error('Error al parsear JSON:', parseErr);
      return res.status(500).json({
        success: false,
        message: 'JSON formatua okerra'
      });
    }
  });
});

// log de los endpoints que estan disponibles
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log('Ruta registrada:', r.route.path);
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});