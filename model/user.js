const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required:true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    emailAddress: {
        type: String,
        required:true
    },
    identityNumber: {
        type: Number,
        required:true
    },
});

const userData = mongoose.model('userData',userSchema);
module.exports = userData