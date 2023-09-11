const express = require('express');
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const bodyParser = require('body-parser');

//middleware
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const problemsRoute = require("./routes/problems");
const usersRoute = require("./routes/users");






//console.log(problemsRoute);
app.use("/api/v1/problems",problemsRoute);
app.use("/api/v1/users",usersRoute);
app.get("/",(req,res) => {
    
    res.send("welcome to upsolver tracker");
});






app.listen(PORT, () => {
    console.log("listening on port ",PORT,"...");
})


