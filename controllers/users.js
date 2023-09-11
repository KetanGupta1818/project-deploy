const mongoose = require('mongoose');
const {connectToDatabase} = require('../db/connection');


const userSchema = new mongoose.Schema({
    user_handle: {type: String, index:true},
    contest_solve_count: Number,
    upsolve_solve_count: Number,
    practice_solve_count: Number
});

async function displayAllUsers(req,res){
    
    
 //const User = mongoose.model('User',userSchema);
    const db = await connectToDatabase();
 //     const db = await mongoose.connect("mongodb+srv://ketan:1234@nodeexpresscluster.iqc8gwy.mongodb.net/?retryWrites=true&w=majority");   //For type binding
      const User = db.model('User',userSchema);
      const users = await User.find({});
      res.send(users);
}

async function addUser(input_user){
    console.log("input_user= " + input_user.user_handle);
        const db = await connectToDatabase();
   // const db = await mongoose.connect("mongodb+srv://ketan:1234@nodeexpresscluster.iqc8gwy.mongodb.net/?retryWrites=true&w=majority");   //For type binding
    const User = db.model('User',userSchema);
    const str = input_user.user_handle+"";
    const user_db = await User.find({user_handle: str});
    if(user_db.length == 0){
        User.create(input_user);
    }
    else{
        user_db[0].contest_solve_count = input_user.contest_solve_count;
        user_db[0].upsolve_solve_count = input_user.upsolve_solve_count;
        user_db[0].practice_solve_count = input_user.practice_solve_count;
        user_db[0].save();
    }
}

module.exports = {displayAllUsers,addUser};