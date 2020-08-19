const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sorteoSchema = new Schema({
  image: String,
  sorteo: String,
  status: String
});

let model;
try {
  model = mongoose.model('sorteos');
} catch (error) {
  model = mongoose.model('sorteos', sorteoSchema);
}

module.exports = model;
