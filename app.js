const express = require("express");
const { product, user } = require("./model/index");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

require("./model/index");

app.get("/", (req, res) => {
  res.render("slash");
});

app.get("/home", async (req, res) => {
  const allProduct = await product.findAll();
  console.log(allProduct);
  res.render("product", { product: allProduct });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (!email || !username || !password) {
    return res.send("Please enter details");
  }

  await user.create({
    email: email,
    username: username,
    password: bcrypt.hashSync(password, 8),
  });

  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const userExist = await user.findAll({
    where: {
      username: username,
    },
  });

  if (userExist.length > 0) {
    const isMatch = bcrypt.compareSync(password, userExist[0].password);
    if (isMatch) {
      res.redirect("/home");
    } else {
      res.render("error");
    }
  } else {
    res.render("error");
  }
});

app.get("/createProduct", (req, res) => {
  res.render("createProduct");
});

app.post("/createProduct", async (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.body.image;
  await product.create({
    name: name,
    price: price,
    description: description,
    image: image,
  });
  res.redirect("/home");
});

app.get("/single/:id", async (req, res) => {
  const id = req.params.id;
  const singleProduct = await product.findAll({
    where: {
      id: id,
    },
  });
  res.render("singleView", { product: singleProduct });
});

app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await product.destroy({
    where: {
      id: id,
    },
  });
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const allProduct = await product.findAll({
    where: {
      id: id,
    },
  });

  res.render("editProduct", { product: allProduct });
});

app.post("/editProduct/:id", async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.body.image;

  await product.update(
    {
      name: name,
      price: price,
      description: description,
      image: image,
    },
    {
      where: {
        id: id,
      },
    }
  );

  res.redirect("/single/" + id);
});

app.listen(3000, () => {
  console.log("NodeJS running at server 3000");
});
