if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const init = require("./passport-config");
init(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const app = express();
const users = [];

app.use(express.urlencoded({ extended: false }));
app.use(flash({}));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnInit: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.set("view-engine", "ejs");

app.get("/", (req, res, next) => {
  res.render("index.ejs", { name: "Sasha" });
});
app.get("/login", (req, res, next) => {
  res.render("login.ejs", { name: "Sasha" });
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
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
  //console.log(users);
});

app.listen(3001);
