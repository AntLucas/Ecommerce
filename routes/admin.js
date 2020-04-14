const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categories")
require("../models/Produto")
const Produto = mongoose.model("products")

router.get("/", (req, res) => {
  res.render("admin/index")
})

router.get("/categorias", (req, res) => {
  Categoria.find().lean().sort({date: "desc"}).then((category) => {
  res.render("admin/categorias", {category: category})
}).catch((err) => {
  console.log("erro: "+ err)
  res.redirect("/admin")
})
})

router.get("/categorias/add", (req, res) => {
  res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req, res) => {
  const novaCategoria = {
    name: req.body.name,
    slug: req.body.slug
  }

  new Categoria(novaCategoria).save().then(() => {
    console.log("Categoria salva com sucesso!")
    res.redirect("/admin/categorias")
  }).catch((err) => {
    console.log("Erro ao salvar a categoria"+ err)
    res.redirect("/admin/categorias")
  })
})

router.get("/categorias/edit/:id", (req, res) => {
  Categoria.findOne({_id: req.params.id}).lean().then((category) => {
          res.render("../views/admin/editcategorias", {category: category})
        }).catch((err) => {
          res.redirect("/admin/categorias")
        })
    })

    router.post("/categoria/edit/", (req, res) => {
      Categoria.findOne({_id: req.body.id}).then((category) => {

        category.name = req.body.name,
        category.slug = req.body.slug

        category.save().then(() => {
          console.log("Categoria editada com sucesso")
          res.redirect("/admin/categorias")
        }).catch((err) => {
          console.log("Erro: "+ err)
          res.redirect("/admin/categorias")
        })

      }).catch((err) => {
        console.log("Erro :C : "+ err)
        res.redirect("/admin/categorias")
      })

    })


router.get("/categorias/deletar/:id", (req, res) => {
  Categoria.deleteOne({_id: req.params.id}).then(() => {
  res.redirect("/admin/categorias")
  }).catch((err) => {
    console.log("Erro :C : "+ err)
    res.redirect("/admin/categorias")
  })
})

router.get("/produtos", (req, res) => {

    Produto.find().populate("category").lean().sort({date: "desc"}).then((products) => {
    res.render("admin/produtos", {products: products})
  }).catch((err) => {
    console.log("erro: "+ err)
    res.redirect("/admin")
  })
})

router.get("/produtos/add", (req, res) => {
  Categoria.find().lean().then((category) => {
  res.render("admin/addprodutos", {category: category})
}).catch((err) => {
  console.log("erro" + err)
})
})

router.post("/produtos/nova", (req, res) => {
  const novoProduto = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    unity: req.body.unity
  }


  new Produto(novoProduto).save().then(() => {
    console.log("Produto salvo com sucesso!")
    res.redirect("/admin/produtos")
  }).catch((err) => {
    console.log("Erro ao salvar o produto"+ err)
  })
})

router.get("/produtos/edit/:id", (req, res) => {
  Produto.findOne({_id: req.params.id}).lean().then((products) => {
        Categoria.find().lean().then((category) => {
          res.render("../views/admin/editprodutos", {category: category, products: products})
        }).catch((err) => {
          console.log("Erro: "+ err)
          res.redirect("/admin/produtos")
        })
    }).catch((err) => {
      console.log("Houve um erro ao carregar o formulário de edição"+ err)
      res.redirect("/admin/produtos")
    })
})

router.post("/produto/edit/", (req, res) => {
  Produto.findOne({_id: req.body.id}).then((products) => {

    products.name = req.body.name,
    products.category = req.body.category,
    products.description = req.body.description,
    products.price = req.body.price,
    products.unity = req.body.unity

    products.save().then(() => {
      console.log("Produto editado com sucesso")
      res.redirect("/admin/produtos")
    }).catch((err) => {
      console.log("Erro: "+ err)
      res.redirect("/admin/produtos")
    })

  }).catch((err) => {
    console.log("Erro :C : "+ err)
    res.redirect("/admin/produtos")
  })

})


router.get("/produtos/deletar/:id", (req, res) => {
  Produto.deleteOne({_id: req.params.id}).then(() => {
    console.log("produto deletado com sucesso!")
  res.redirect("/admin/produtos")
  }).catch((err) => {
    console.log("Erro :C : "+ err)
    res.redirect("/admin/produtos")
  })
})


module.exports = router
