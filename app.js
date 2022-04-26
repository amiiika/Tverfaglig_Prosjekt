//requiring modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//database
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = {
  username: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);

//host the websites
app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/register", function (req, res) {
  res.render("register.ejs");
});

app.get("/signin", function (req, res) {
  res.render("signin.ejs");
});

//Register a user
app.post("/regsister", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  const newUser = new User({
    username: username,
    password: password,
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("/home");
    }
  });
});

//localhoast:200
app.listen(200, function () {
  console.log("The server has started :P");
});
