const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categories")
require("../models/Produto")
const Produto = mongoose.model("products")
const {isAdmin} = require("../helpers/isAdmin")

router.get("/", isAdmin, (req, res) => {
  res.render("admin/index")
})

router.get("/categorias", isAdmin, (req, res) => {
  Categoria.find().lean().sort({date: "desc"}).then((category) => {
  res.render("admin/categorias", {category: category})
}).catch((err) => {
  console.log("erro: "+ err)
  res.redirect("/admin")
})
})

router.get("/categorias/add", isAdmin, (req, res) => {
  res.render("admin/addcategorias")
})

router.post("/categorias/nova", isAdmin, (req, res) => {

  var erros = []
  if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
    erros.push({texto: "Nome inválido"})
  }

  if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
    erros.push({texto: "Slug inválido"})
  }

  if(req.body.name.length < 2){
    console.log("erro");
    erros.push({texto: "Nome da categoria é muito pequeno"})
  }

  if(erros.length > 0){
    res.render("../views/admin/addcategorias", {erros: erros})
  }
  else{

    const novaCategoria = {
      name: req.body.name,
      slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
      console.log("Categoria salva com sucesso!")
      req.flash("success_msg", "Categoria criada com sucesso!")
      res.redirect("/admin/categorias")
    }).catch((err) => {
      console.log("Erro ao salvar a categoria"+ err)
      req.flash("error_msg", "Ocorreu um erro ao salvar a categoria")
      res.redirect("/admin/categorias")
    })

  }
})


  router.get("/categorias/edit/:id", isAdmin, (req, res) => {
  Categoria.findOne({_id: req.params.id}).lean().then((category) => {
          res.render("../views/admin/editcategorias", {category: category})
        }).catch((err) => {
          res.redirect("/admin/categorias")
        })
    })

    router.post("/categoria/edit/", isAdmin, (req, res) => {
      Categoria.findOne({_id: req.body.id}).then((category) => {

        var erros = []
        if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
          erros.push({texto: "Nome inválido"})
        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
          erros.push({texto: "Slug inválido"})
        }

        if(req.body.name.length < 2){
          console.log("erro");
          erros.push({texto: "Nome da categoria é muito pequeno"})
        }

        if(erros.length > 0){
          res.render("../views/admin/editcategorias", {erros: erros})
        }
        else{

        category.name = req.body.name,
        category.slug = req.body.slug

          category.save().then(() => {
            console.log("Categoria editada com sucesso")
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
          }).catch((err) => {
            console.log("Erro: "+ err)
            req.flash("error_msg", "Ocorreu um erro ao editar a categoria")
            res.redirect("/admin/categorias")
          })

        }

      }).catch((err) => {
        console.log("Erro :C : "+ err)
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/admin/categorias")
      })

    })


router.get("/categorias/deletar/:id", isAdmin, (req, res) => {
  Categoria.deleteOne({_id: req.params.id}).then(() => {
  req.flash("success_msg", "Categoria deletada com sucesso!")
  res.redirect("/admin/categorias")
  }).catch((err) => {
    console.log("Erro :C : "+ err)
    res.redirect("/admin/categorias")
  })
})

router.get("/produtos", isAdmin, (req, res) => {

    Produto.find().populate("category").lean().sort({date: "desc"}).then((products) => {
    res.render("admin/produtos", {products: products})
  }).catch((err) => {
    console.log("erro: "+ err)
    res.redirect("/admin")
  })
})

router.get("/produtos/add", isAdmin, (req, res) => {
  Categoria.find().lean().then((category) => {
  res.render("admin/addprodutos", {category: category})
}).catch((err) => {
  console.log("erro" + err)
})
})

router.post("/produtos/nova", isAdmin, (req, res) => {


    var erros = []
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
      erros.push({texto: "Nome inválido"})
    }

    if(!req.body.price || typeof req.body.price == undefined || req.body.price == null){
      erros.push({texto: "Preço inválido"})
    }

    if(req.body.price > 0 || req.body.price < 0){

    }
    else{
      erros.push({texto: "O campo preço deve receber apenas números utilize \".\" para as casas decimais"})
    }

    if(!req.body.unity || typeof req.body.unity == undefined || req.body.unity == null){
      erros.push({texto: "Unidade inválida"})
    }

    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
      erros.push({texto: "Descrição inválida"})
    }
    if(req.body.category == 0){
      erros.push({texto: "Categoria inválida, se necessário cadaste uma nova categoria"})
    }

    if(erros.length > 0){
      res.render("../views/admin/addprodutos", {erros: erros})
    }
    else{

      const novoProduto = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        unity: req.body.unity
      }


      new Produto(novoProduto).save().then(() => {
        console.log("Produto salvo com sucesso!")
        req.flash("success_msg", "Produto salvo com sucesso!")
        res.redirect("/admin/produtos")
      }).catch((err) => {
        console.log("Erro ao salvar o produto"+ err)
        req.flash("error_msg", "Erro ao salvar o produto")
        res.redirect("/admin/produtos")
      })

    }
})

router.get("/produtos/edit/:id", isAdmin, (req, res) => {
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

router.post("/produto/edit/", isAdmin, (req, res) => {
  Produto.findOne({_id: req.body.id}).then((products) => {

    var erros = []
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
      erros.push({texto: "Nome inválido"})
    }

    if(!req.body.price || typeof req.body.price == undefined || req.body.price == null){
      erros.push({texto: "Preço inválido"})
    }

    if(req.body.price > 0 || req.body.price < 0){

    }
    else{
      erros.push({texto: "O campo preço deve receber apenas números utilize \".\" para as casas decimais"})
    }

    if(!req.body.unity || typeof req.body.unity == undefined || req.body.unity == null){
      erros.push({texto: "Unidade inválida"})
    }

    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
      erros.push({texto: "Descrição inválida"})
    }
    if(req.body.category == 0){
      erros.push({texto: "Categoria inválida, se necessário cadaste uma nova categoria"})
    }

    if(erros.length > 0){
      res.render("../views/admin/editprodutos", {erros: erros})
    }
    else{

      products.name = req.body.name,
      products.category = req.body.category,
      products.description = req.body.description,
      products.price = req.body.price,
      products.unity = req.body.unity

      products.save().then(() => {
        console.log("Produto editado com sucesso")
        req.flash("success_msg","Produto editado com sucesso!")
        res.redirect("/admin/produtos")
      }).catch((err) => {
        console.log("Erro: "+ err)
        req.flash("error_msg","Houve um erro ao editar o produto")
        res.redirect("/admin/produtos")
      })

    }

  }).catch((err) => {
    console.log("Erro :C : "+ err)
    req.flash("error_msg","Erro interno")
    res.redirect("/admin/produtos")
  })

})


router.get("/produtos/deletar/:id", isAdmin, (req, res) => {
  Produto.deleteOne({_id: req.params.id}).then(() => {
    console.log("produto deletado com sucesso!")
    req.flash("success_msg", "Produto deletado com sucesso!")
    res.redirect("/admin/produtos")

  }).catch((err) => {
    console.log("Erro :C : "+ err)
    req.flash("error_msg", "Houve um erro interno!")
    res.redirect("/admin/produtos")
  })
})


module.exports = router
