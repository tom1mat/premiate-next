const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publicidadSchema = new Schema({
  video: String,
  publicidad: String,
});

let model;
try {
  model = mongoose.model('publicidades');
} catch (error) {
  model = mongoose.model('publicidades', publicidadSchema);
}

module.exports = model;
