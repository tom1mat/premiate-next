const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name: String,
    email: String,
    password: String,
    surname: String,
    avatar: String,
    credits: Number,
    creditsUsed: Number,
    googleData: Object,
    sorteos: Object,
    subastas: Object,
});

let model;
try {
  model = mongoose.model('users');
} catch (error) {
  model = mongoose.model('users', usersSchema);
}

module.exports = model;
