const mongoose = require('mongoose');

const ModalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image1: { type: String, default: null },
  image2: { type: String, default: null },
  image3: { type: String, default: null },
  image4: { type: String, default: null },
  image5: { type: String, default: null }
});

const Modal = mongoose.model('Modal', ModalSchema);

module.exports = Modal;
