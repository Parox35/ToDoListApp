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

const authRouter = require(path.join(__dirname, "routes/auth.js"));
const listsRouter = require(path.join(__dirname, "routes/lists.js"));

// Routes
app.use('/auth', authRouter);
app.use('/', listsRouter);

module.exports = app;
