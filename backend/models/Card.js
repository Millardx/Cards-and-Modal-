// models/Card.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  areaName: String,
  weather: String,
  quickfacts: String,
  image: String,
  weatherIcon: String
});

module.exports = mongoose.model('Card', cardSchema);
