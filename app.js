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

// Configuraçõe
  // Sessão

  // Middleware

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
