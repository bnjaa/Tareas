const express = require('express');
const app = express();
const path = require('path');

// Settings
app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false})); // recibe datos de formulario
// Routes
const routes = require('./routes/participantes');
app.use('/', routes);

// statics files
    // fotos o weas asi

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});