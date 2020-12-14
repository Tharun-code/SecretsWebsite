//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/usersDb",{useNewUrlParser: true})

const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema ({
  Username: String,
  Password: String
});


const secret = process.env.SECRET
userSchema.plugin(encrypt, {secret:secret, encryptedFields:["Password"]})

console.log(secret);
const User = mongoose.model("User", userSchema)

app.get("/", function(req, res){
  res.render("home");
})

app.get("/login", function(req, res){
  res.render("login");
})

app.get("/register", function(req, res){
  res.render("register");
})

app.get("/secrets/:userid", function(req, res){
    res.send("successfully entered to the page " + req.params.userid)

})


app.post("/register", function(req, res){
  User.findOne({Username: req.body.username}, function(err, foundOne){
    if (!foundOne){
      const user = new User ({
        Username: req.body.username,
        Password:  req.body.password
    })
        user.save();
      // res.redirect("/secrets/" + req.body.username)
      res.render("secrets")
    } else if (foundOne){
      res.redirect("/login");
    }
  })
  })

// app.post("/secrets/:Userid", function(req, res){
//       req.params.Userid
// })

app.post("/login", function(req, res){

  User.findOne({Username: req.body.username}, function(err, foundOne){
    if (foundOne.Password === req.body.password){
            // res.redirect("/secrets/" + req.body.username)
          res.render("secrets")
    } else {
      res.send("Enter Correct Password")
    }
  })
})


app.listen(3000, function(){
  console.log("Server is listening to the port 3000");
})
