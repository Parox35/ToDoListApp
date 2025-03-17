const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
require("dotenv").config();

// Configuration de Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const session = require('express-session');

app.use(session({
    secret: 'secret', // Clé secrète pour signer le cookie de session
    resave: false, // Ne pas enregistrer la session si elle n'est pas modifiée
    saveUninitialized: true, // Enregistrer les sessions non initialisées
    userId: null,
}));


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const authRouter = require(path.join(__dirname, "routes/auth.js"));
const listsRouter = require(path.join(__dirname, "routes/lists.js"));
const passwordResetRouter = require(path.join(__dirname, "routes/passwordReset.js"));

// Routes
app.use('/passwordReset', passwordResetRouter);
app.use('/auth', authRouter);
app.use('/', listsRouter);

module.exports = app;
