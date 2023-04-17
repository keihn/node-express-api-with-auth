const mongoose = require('mongoose');

const dbHandler = (dbURL) => {
    mongoose.connect(dbURL)
    .catch(console.log("DB handsake failed"))
}


module.exports = dbHandler