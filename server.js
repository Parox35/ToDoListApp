const app = require('./app');
const sequelize = require('./config');
const User = require('./models/User');
const List = require('./models/List');
const Task = require('./models/Task');

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});
