// Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
// rota admin
const admin = require("./routes/admin")
// rota usuario
const usuario = require("./routes/usuario")
// módulo path, trabalhar com diretórios e manipular pastas
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require("passport")
require("./config/auth")(passport)

// Configuraçõe
  // Sessão
    //app.use serve para criação e configuração de Middleware
    app.use(session({
      secret: "ecommerceficticio",
      resave: true,
      saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())


    app.use(flash())
  // Middleware
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    //armazenar os dados do usuário autenticado
    res.locals.user = req.user || null
    next()
  })

  // Body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
  // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
  // Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/ecommerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log("Conectado com sucesso")
    }).catch((err) => {
      console.log("Erro ao se conectar" + err)
    })
  // Public
    // pasta que contém os arquivos estáticos é a public
    app.use(express.static(path.join(__dirname, "public")))
// Rotas
app.get("/", (req, res) => {
  res.render("")
})
  //definindo a rota admin
  app.use("/admin", admin)
  //definindo a rota usuario
  app.use("/usuarios", usuario)

// Outros
const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
  console.log("Servidor rodando!")
})
