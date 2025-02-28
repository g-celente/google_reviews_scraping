const { Sequelize } = require("sequelize")
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
})


sequelize.authenticate()
    .then(() => console.log("Banco conectado com sucesso"))
    .catch(err => console.log("Erro o logar no banco de dados: " + err))

module.exports = sequelize;