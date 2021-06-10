const express = require('express');
const router = express.Router();
const Category = require('./category');
const slugify = require('slugify');


router.get("/admin/categories/new",(req, res) => {
    res.render("./admin/categories/new");
});


router.post("/categories/save", (req, res) => {
    var title = req.body.title;
    if(title != undefined){
      Category.create({
        title: title,
        slug: slugify(title) // otimiza o titulo pra ser usado na rota da url
      }).then(() =>{
          res.redirect("/admin/categories");

      })
    }else{
      res.redirect("/admin/categories/new");
    }

});

// listar Categorias
router.get("/admin/categories", (req, res) => {
  //model Categorias
  Category.findAll().then(categories =>{
    res.render("admin/categories/index", {categories: categories});
  });


});

//deletar Categorias
router.post("/categories/delete", (req, res)=>{
    var id = req.body.id;
    if(id != undefined){
      if(!isNaN(id)){
        Category.destroy({
            where:{
              id: id
            }
        }).then(() =>{
          res.redirect('/admin/categories');
        });
      }else{ // NÃO FOR UM NUMERO
        res.redirect("/admin/categories");
      }

    }else{ //NULL
      res.redirect("/admin/categories");
    }

});

// editar Categorias
router.get("/admin/categories/edit/:id", (req, res)=>{
    var id = req.params.id;
    if(isNaN(id)){
      res.redirect("/admin/categories");
    }
    Category.findByPk(id).then(category =>{
      if(category != undefined){

        res.render("admin/categories/edit", {category: category});

      }else{
        res.redirect("/admin/categories");
      }
    }).catch(err =>{
      res.redirect("/admin/categories");
    })
});

// atualizar categorias 
router.post("/categories/update", (req, res)=>{
  var id = req.body.id;
  var title = req.body.title;

  Category.update({title: title, slug: slugify(title)},{
      where:{
        id:id
      }
  }).then(()=>{
    res.redirect("/admin/categories");

  })
});

module.exports = router;