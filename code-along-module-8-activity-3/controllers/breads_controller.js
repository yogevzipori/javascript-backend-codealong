const express = require("express");
const breads = express.Router();
const Bread = require("../models/bread.js");

// INDEX
breads.get("/", (req, res) => {
  // get data from model
  Bread.find().then((foundBreads) => {
    // use data in rendering view
    res.render("index", {
      breads: foundBreads,
      title: "Index Page",
    });
  });
});

// CREATE
breads.post("/", (req, res) => {
  // this is data from the view, and we're formatting it
  if (!req.body.image) {
    req.body.image = undefined;
  }
  if (req.body.hasGluten === "on") {
    req.body.hasGluten = true;
  } else {
    req.body.hasGluten = false;
  }
  // send it to the model (which will send it to the db)
  Bread.create(req.body);
  res.redirect("/breads");
});

// NEW
breads.get("/new", (req, res) => {
  res.render("new");
});

// SHOW
breads.get("/:id", (req, res) => {
  Bread.findById(req.params.id)
    .then((foundBread) => {
      res.render("show", {
        bread: foundBread,
      });
    })
    .catch((err) => {
      res.send("404");
    });
});

// SHOW
breads.get("/:id", (req, res) => {
  Bread.findById(req.params.id).then((foundBread) => {
    const bakedBy = foundBread.getBakedBy();
    console.log(bakedBy);
    res.render("show", {
      bread: foundBread,
    });
  });
});

// DELETE
breads.delete("/:id", (req, res) => {
  Bread.findByIdAndDelete(req.params.id).then((deletedBread) => {
    res.status(303).redirect("/breads");
  });
});

// UPDATE
breads.put("/:id", (req, res) => {
  if (req.body.hasGluten === "on") {
    req.body.hasGluten = true;
  } else {
    req.body.hasGluten = false;
  }
  Bread.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((updatedBread) => {
    console.log(updatedBread);
    res.redirect(`/breads/${req.params.id}`);
  });
});

// EDIT
breads.get("/:id/edit", (req, res) => {
  Bread.findById(req.params.id).then((foundBread) => {
    res.render("edit", {
      bread: foundBread,
    });
  });
});

// seed data
breads.get("/data/seed", (req, res) => {
  Bread.insertMany([
    {
      name: "Rye",
      hasGluten: true,
      image:
        "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    },
    {
      name: "French",
      hasGluten: true,
      image:
        "https://images.unsplash.com/photo-1534620808146-d33bb39128b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    {
      name: "Gluten Free",
      hasGluten: false,
      image:
        "https://images.unsplash.com/photo-1546538490-0fe0a8eba4e6?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80",
    },
    {
      name: "Pumpernickel",
      hasGluten: true,
      image:
        "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80",
    },
  ]).then((createdBreads) => {
    res.redirect("/breads");
  });
});

module.exports = breads;
