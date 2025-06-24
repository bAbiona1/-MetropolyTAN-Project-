const mysql = require('mysql2/promise');

// Configuration directe sans variables d'environnement
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',          // Utilisateur MySQL
  password: 'root',      // Mot de passe MySQL
  database: 'carpooling',// Base de données
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de la connexion
pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to the database.');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

module.exports = pool;
