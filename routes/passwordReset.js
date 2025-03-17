const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const User = require('../models/User');
const Token = require('../models/Token');

clientURL = process.env.BASE_URL;

router.get('/', (req, res) => {
  res.render('passwordReset.pug', { title: 'Mot de passe oublié' });
});
  
router.post('/', async (req, res) => {
  const email = req.body.email;
  console.log(email);
  try {
      // Récupérer l'utilisateur dans la base de données
      const user = await User.findOne({ where: { email: email } });
  
      if (!user) {
          return res.status(400).render('passwordReset.pug', { title: 'Mot de passe oublié', messageErreur: 'Email inconnu.' });
      }

      //Vérifier si l'utilisateur a déjà un token
      let token = await Token.findOne({ where: { userId: user.id } });
      if (token) {
          await token.destroy();
      }
  
      // Générer un token de réinitialisation de mot de passe
      const resetToken = crypto.randomBytes(32).toString("hex");
      console.log(resetToken);
      const hashedToken = await bcrypt.hash(resetToken, 10);

      // Créer un token dans la base de données
      await Token.create({
          userId: user.id,
          token: hashedToken,
          createdAt: Date.now(),
      });

      // Envoyer un email avec le token
      const link = `${clientURL}/passwordReset/${resetToken}/${user.id}`;

      const bodyEmail = 
        `<div>
          <p>Hello,</p>
          <p>You requested to reset your password.</p>
          <p> Please, click the link below to reset your password<p><a href="${link}">Reset Password</a>
        </div>`;

      sendEmail(user.email, "Password Reset", bodyEmail);
    
      // Rediriger vers la page de connexion
      res.redirect('/auth/signin');

  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la réinitialisation du mot de passe.' + error);
  }
});

router.get('/:token/:id', async (req, res) => {
  const token = req.params.token;
  const id = req.params.id;

  try {
    userToken = await Token.findOne({ where: { userId: id } });
    // Vérifier si le token existe
    if (!bcrypt.compare(token, userToken.token)) {
      return res.status(400).send('Token invalide.');
    }
    res.render('newPassword.pug', { title: 'Nouveau mot de passe', userId: id, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la réinitialisation du mot de passe.');
  }
});

router.post('/:token/:id', async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
      return res.status(400).render('newPassword.pug', { title: 'Nouveau mot de passe', userId: id, token: token, messageErreur: 'Les mots de passe ne correspondent pas.' });
    }
    // Chiffrer le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    await User.update({ password: hashedPassword }, { where: { id: id } });

    // Supprimer le token de réinitialisation de mot de passe
    await Token.destroy({ where: { userId: id } });

    res.redirect('/auth/signin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la réinitialisation du mot de passe.');
  }
});


module.exports = router;