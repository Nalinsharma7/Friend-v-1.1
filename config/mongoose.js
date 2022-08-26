const mongoose = require('mongoose');
const env = require('./environment');
mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on('error',console.error.bind(console,"ERROR CONNECTING TO MONGOdb"));

db.once('open',function(){
    console.log('Connected to DB :: MongoDB');
})

module.exports = db;