const sequelize = require('./utils/db.js');
const Review = require('./models/Review');

sequelize.sync({ force: false }) // ⚠️ force: true recria tabelas, cuidado!
  .then(() => {
    console.log("✅ Banco de dados atualizado!");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Erro ao atualizar banco:", err);
    process.exit(1);
  });
