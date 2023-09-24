const express = require("express");
const { product } = require("./model/index");
const app = express();

// form bata data aairaxa parse gara or handle gar vaneko ho
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//telling node to use ejs

app.set("view engine", "ejs");

//dbconnection
require("./model/index");

app.get("/", (req, res) => {
  res.render("product");
});

app.get("/createProduct", (req, res) => {
  res.render("createProduct");
});

app.post("/createProduct", async (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  await product.create({
    name: name,
    price: price,
    description: description,
  });
  console.log(req.body);
  res.send("Product Added Successfully");
});

app.listen(3000, () => {
  console.log("NodeJS running at server 3000");
});
