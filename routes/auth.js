const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/signup', (req, res) => {
  res.render('signup.pug', { title: 'Inscription' });
});


router.post('/signup', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Vérifier que les mots de passe correspondent
  if (password !== confirmPassword) {
    return res.status(400).render('signup.pug', { title: 'Inscription', messageErreur:  "Les mots de passe ne correspondent pas."});
  }

  try {
    // Vérifier si l'email est déjà utilisé
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).render('signup.pug', { title: 'Inscription', messageErreur:  'Cet email est déjà utilisé.'});
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur dans la base de données
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });
    // Stocker l'ID de l'utilisateur dans la session
    req.session.userId = newUser.dataValues.id;

    // Rediriger vers la page d'accueil
    res.redirect('/');

  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la création du compte.');
  }
});

router.get('/signin', (req, res) => {
    res.render('signin.pug', { title: 'Connexion' });
  });
  
  
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;


  try {
    // Récupérer l'utilisateur dans la base de données
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.dataValues.password))) {
      return res.status(400).render('signin.pug', { title: 'Connexion', messageErreur: 'Email ou mot de passe incorrect.' });
    }

    // Stocker l'ID de l'utilisateur dans la session
    req.session.userId = user.dataValues.id;

    // Rediriger vers la page d'accueil
    res.redirect('/');

  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la connexion.');
  }
});


module.exports = router;
