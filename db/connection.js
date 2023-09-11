const mongoose = require('mongoose');
require("dotenv").config();
let databaseConnection = undefined;

async function connectToDatabase(){
    if(!databaseConnection){
        databaseConnection =  mongoose.connect(process.env.MONGODB_URL);
    } 
    return databaseConnection;
}
module.exports = {connectToDatabase};