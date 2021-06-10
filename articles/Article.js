const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category')


const Article = connection.define('articles', {
  title:{
      type: Sequelize.STRING,
      allowNull: false,
  },slug:{
      type: Sequelize.STRING,
      allowNull: false
  },body:{
      type: Sequelize.TEXT,
      allowNull: false
  }
})
// * Relacionamento
Category.hasMany(Article); // UMA Categoria tem muitos artigos
Article.belongsTo(Category);// Um Artigo pertece a uma categoria

// sicronizar os dados com banco
//Article.sync({force: true});

module.exports = Article;