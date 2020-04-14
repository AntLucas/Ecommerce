const express = require('express')
const router = express.Router()

router.get("/registro", (req, res) => {
  res.render("usuarios/registro")
})

router.get("/login", (req, res) => {
  res.render("usuarios/login")
})

module.exports = router
