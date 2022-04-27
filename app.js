//requiring modules
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//autentication modules
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//enable the css, ejs and bodyparser
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//use session
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

//using passport to manage session
app.use(passport.initialize());
app.use(passport.session());

//connect and make database
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

//use passport-local-mongoose as a plugin
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

//serialize and deserialize users
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//host the views
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/signin", function (req, res) {
  res.render("signin");
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

//after logging in views
app.get("/home", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("home");
  } else {
    res.redirect("/signin");
  }
});

app.get("/configuration", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("configuration");
  } else {
    res.redirect("/signin");
  }
});

app.get("/riskAnalysis", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("riskAnalysis");
  } else {
    res.redirect("/signin");
  }
});

app.get("/githubProjects", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("githubProjects");
  } else {
    res.redirect("/signin");
  }
});

//register a user
app.post("/register", function (req, res) {
  //requiring the input fields
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  //check if passwords match
  if (password === password2) {
    User.register({ username: username }, password, function (err, user) {
      if (err) {
        //if error send user back to register
        console.log(err);
        res.redirect("/register");
      } else {
        //save the user with cookies
        passport.authenticate("local")(req, res, function () {
          res.redirect("/home");
        });
      }
    });
  } else {
    //error message when passwords don't match
    document.getElementById("error-message").innerHTML =
      "Passwords don't match";
  }
});

//sign in a user
app.post("/signin", function (req, res) {
  //requiring the input fields
  const username = req.body.username;
  const password = req.body.password;

  //login credentials
  const user = new User({
    username: username,
    password: password,
  });

  //authenticate the user
  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/signin");
    } else {
      //save the user with cookies
      passport.authenticate("login")(req, res, function () {
        res.redirect("/home");
      });
    }
  });
});

//localhoast:200
app.listen(200, function () {
  console.log("The server has started :P");
});
