const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Configuration de Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/lists', require('./routes/lists'));

module.exports = app;
