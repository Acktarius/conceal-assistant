// index.js

//Required External Modules
const express = require("express");
const path = require("path");

//App Variables
const app = express();
const port = process.env.PORT || "3500"; 

//App Configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

//Routes Definitions
app.get("^/$|/index(.html)?", (req, res) => {
    res.render("index", { title: "Home" });
  });

app.get("/user(.html)?", (req, res) => {
    res.render("user", { title: "Profile", userProfile: { name: "Admin" } });
  });

//Server Activation
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });