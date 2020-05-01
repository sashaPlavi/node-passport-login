const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
const users = [];

app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");

app.get("/", (req, res, next) => {
  res.render("index.ejs", { name: "Sasha" });
});
app.get("/login", (req, res, next) => {
  res.render("login.ejs", { name: "Sasha" });
});
app.post("/login", (req, res, next) => {});
app.get("/register", (req, res, next) => {
  res.render("register.ejs", { name: "Sasha" });
});
app.post("/register", async (req, res, next) => {
  try {
    const hashPass = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashPass,
    });
    res.redirect("/login");
  } catch (error) {
    res.redirect("register");
  }
  console.log(users);
});

app.listen(3001);
