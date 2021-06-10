const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController');
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");


//view engine
app.set("view engine", 'ejs');

// sessions
app.use(session({
  secret: "fmsmfspfmspfspjprmepjrkiereenehewnohdrgebiaisauyfua",
  cookie:{maxAge: 3000000}

}))


//Static 
app.use(express.static("public"));


// Body body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// conectar banco
connection
    .authenticate()
    .then(()=>{
      console.log("Conexão feita com sucesso");
    }).catch((err)=>{
      console.log(err);
    })

//articles
app.use("/", articlesController);   
//categories
app.use("/", categoriesController);
//users
app.use('/', usersController);


// rotas 

//rota principal
app.get("/", (req, res) => {
  Article.findAll({
    order:[
      ['id','DESC']

    ],
    limit:4
  }).then(articles =>{
    Category.findAll().then(categories => {
      res.render("index", {articles: articles, categories: categories});
    });
  });
});

// visualizar artigo
app.get("/:slug", (req, res) => {
  var slug = req.params.slug;

  Article.findOne({
    where: {
      slug: slug
    }

  }).then(article =>{
      if(article != undefined){
        Category.findAll().then(categories => {
          res.render("article", {article: article, categories: categories});
        });
      }else{
        res.redirect("/");
      }
  }).catch(err =>{
    res.redirect("/")
  });

  })

  // listar categoria
app.get("/category/:slug", (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where:{
      slug: slug
    },
    include: [{model:Article}]
  }).then(category =>{
    if(category != undefined){
      Category.findAll().then(categories => {
        res.render("index", {articles: category.articles, categories: categories})
      })

    }else{
      res.redirect("/");
    }
  }).catch(err =>{
    res.redirect("/");
  })
})


//servidor
app.listen(3000, () =>{
  console.log("Servidor rodando na porta 3000");
});










// redis = banco de dados que salva sessões em cache

// sessions
// app.get("/session", (req, res) =>{
//   req.session.treinamento = "Formação node.js"
//   req.session.ano = 2021
//   req.session.email = "rafael@gmail.com"
//   req.session.user ={
//     username: "rafael",
//     email: "rafael@gmail.com",
//     id: 10
//   }
//   res.send("Sessão gerada!");

// });

// app.get("/leitura", (req, res) =>{
//   res.json({
//     treinamento: req.session.treinamento,
//     ano: req.session.ano,
//     email: req.session.email,
//     user: req.session.user,
 
//   })

// });
