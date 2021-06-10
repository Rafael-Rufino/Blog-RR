const express  = require('express');
const router = express.Router();
const User = require("./User");
const bcript = require('bcryptjs');


// usuario
router.get("/admin/users", (req, res) => {
  //listar todos usuarios
  User.findAll().then(users =>{
      res.render('admin/users/index', {users: users});
  });

});
// formulario
router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");

});
// criar usuario
router.post("/users/create", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  // procure por um email
  User.findOne({where:{email: email}}).then(user => {
    if(user == undefined){
      var salt = bcript.genSaltSync(10);
      var hash = bcript.hashSync(password, salt);
    
      User.create({
        email: email,
        password: hash
      }).then(() => {
        res.redirect("/");
      }).catch((err) =>{
        res.redirect("/");
      });

    }else{
      res.redirect("/admin/users/create");
    }
  });

  //teste
  //res.json({email, password});
});


//deletar usuarios
router.post("/users/delete", (req, res)=>{
  var id = req.body.id;
  if(id != undefined){
    if(!isNaN(id)){
      User.destroy({
          where:{
            id: id
          }
      }).then(() =>{
        res.redirect('/admin/users/');
      });
    }else{ // NÃO FOR UM NUMERO
      res.redirect("/admin/users/");
    }

  }else{ //NULL
    res.redirect("/admin/users/");
  }

});


//login
router.get("/login", (req, res)=>{
  res.render("admin/users/login");
});

router.post("/authenticate", (req, res)=>{
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({where: {email: email}}).then(user => {
    if(user != undefined){// Se existe um usuario com esse e-mail
      // Validar senha
      var correct = bcript.compareSync(password, user.password);
      if(correct){
        req.session.user ={
          id: user.id,
          email: user.email
        }
        res.redirect("admin/articles");

      }else{
        res.redirect("/login");  
      }

    }else{
      res.redirect("/login");
    }
  });
});
// logout
router.get("/logout", (req, res) =>{
  req.session.user = undefined;
  res.redirect("/");
})

// user


module.exports = router;

//utilizar hash no lugar de criptografia
// * bcriptjs
