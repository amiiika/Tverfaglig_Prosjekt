//environment variable
require("dotenv").config();

//requiring modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//database
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = {
  username: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);

//host the views
app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/register", function (req, res) {
  res.render("register.ejs");
});

app.get("/signin", function (req, res) {
  res.render("signin.ejs");
});

//register a user
app.post("/register", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  if (password === password2) {
    const newUser = new User({
      username: username,
      password: password,
    });

    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("home");
      }
    });
  } else {
    alert("The passwords don't match");
  }
});

//sign in a user
app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else if (foundUser) {
      if (foundUser.password === password) {
        res.render("home");
        console.log("it worked");
      }
    }
  });
});

//localhoast:200
app.listen(200, function () {
  console.log("The server has started :P");
});
