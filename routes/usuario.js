const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const User = mongoose.model("users")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registro", (req, res) => {
  res.render("usuarios/registro")
})

router.post("/novo", (req, res) => {

  var erros = []

  if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
    erros.push({texto: "Nome inválido"})
  }

  if(!req.body.surname || typeof req.body.surname == undefined || req.body.surname == null){
    erros.push({texto: "Sobrenome inválido"})
  }

  if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
    erros.push({texto: "Email inválido"})
  }

  if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
    erros.push({texto: "Senha inválida"})
  }

  if(req.body.password != req.body.password2){
    erros.push({texto: "As senhas são diferentes"})
  }

  if(!req.body.address || typeof req.body.address == undefined || req.body.address == null){
    erros.push({texto: "Endereço inválido"})
  }

  if(req.body.name.address < 10){
    erros.push({texto: "Endereço muito curto"})
  }

  if(!req.body.city || typeof req.body.city == undefined || req.body.city == null){
    erros.push({texto: "Cidade inválida"})
  }

  if(!req.body.zip || typeof req.body.zip == undefined || req.body.zip == null){
    erros.push({texto: "Cep inválido"})
  }

  if(req.body.zip > 0 || req.body.zip < 0){

  }
  else{
    erros.push({texto: "O campo Cep deve receber apenas números"})
  }

  if(erros.length > 0){
    res.render("../views/usuarios/registro", {erros: erros})
  }
  else{
    User.findOne({email: req.body.email}).then((user) => {
      if(user){
        req.flash("error_msg", "Já existe uma conta com esse email")
        res.redirect("/usuarios/registro")
      }
      else{
        const novoUsuario = new User({
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          password: req.body.password,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          //isAdmin: 1
        })

        bcrypt.genSalt(10, (erro, salt) => {
          bcrypt.hash(novoUsuario.password, salt, (erro, hash) => {
            if(erro){
              req.flash("error_msg", "Houve um erro durante o salvamento do usuário")
              res.redirect("/")
            }

            novoUsuario.password = hash

            novoUsuario.save().then(() => {
              req.flash("success_msg", "Usuário criado com sucesso!")
              res.redirect("/")
            }).catch((err) => {
              req.flash("error_msg", "Erro interno")
              res.redirect("/")
            })
          })
        })
      }
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno")
      res.redirect("/")
    })
  }
})

router.get("/login", (req, res) => {
  res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/usuarios/login",
    failureFlash: true
  })(req, res, next)

})

module.exports = router
