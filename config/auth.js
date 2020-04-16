const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de Usuário
require("../models/Usuario")
const User = mongoose.model("users")

module.exports = function(passport){

  passport.use(new localStrategy({usernameField : 'email', passwordField: 'password'}, (email, password, done) => {
    User.findOne({email: email}).then((user) => {
      if(!user){
        return done(null, false, {message: "Esta conta não existe"})
      }
      else{

        bcrypt.compare(password, user.password, (erro, batem) => {
          if(batem){
            return done(null, user)
          }
          else{
            return done(null, false, {message: "Senha incorreta"})
          }
        })

      }
    })
  }))

  // salvar os dados do usuário em uma sessão
  passport.serializeUser((user, done) => {

    done(null, user.id)

  })

  passport.deserializeUser((id, done) => {
    // procurar um usuário pelo seu id
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
