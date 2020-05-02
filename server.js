if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodO = require("method-override");

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
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodO("_method"));
app.set("view-engine", "ejs");

app.get("/", checkAuth, (req, res, next) => {
  res.render("index.ejs", { name: req.user.name });
});
app.get("/login", checkNotAuth, (req, res, next) => {
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
app.get("/register", checkNotAuth, (req, res, next) => {
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
app.delete("/logout", (req, res, next) => {
  req.logOut();
  res.redirect("/login");
});
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}
function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    return next();
  }
}

app.listen(3001);
