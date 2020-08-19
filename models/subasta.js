const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subastaSchema = new Schema({
    title: String,
    dateString: String,
    amount: Number,
    status: String,
    winnerId: String,
    image: String,
});

let model;
try {
  model = mongoose.model('subastas');
} catch (error) {
  model = mongoose.model('subastas', subastaSchema);
}

module.exports = model;

