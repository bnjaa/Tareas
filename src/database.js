const mysql = require('mysql');

const mysqlConexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'proyecto_bdd',
  multipleStatements: true
});
mysqlConexion.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('db is connected');
  }
});

module.exports = mysqlConexion;