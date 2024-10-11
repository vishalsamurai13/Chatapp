const mongoose = require('mongoose');

//Connection logic

mongoose.connect(process.env.CONN_STRING);

//Connection State
const db = mongoose.connection;

//Check Db Connection

db.on('connected' , () => {
    console.log("Db Connection Succesfull!")
})

db.on('err', () => {
    console.log("Db Connection Failed!")
})

module.exports = db;