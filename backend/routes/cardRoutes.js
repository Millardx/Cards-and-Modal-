// routes/cardRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Card = require('../models/Card');  // Import the Card model

const router = express.Router();

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// GET route to fetch the card data
router.get('/', async (req, res) => {
  try {
    const card = await Card.findOne();
    if (!card) return res.status(404).json({ error: 'No card found' });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching card' });
  }
});

// POST route to update card data and upload files
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'weatherIcon', maxCount: 1 }
]), async (req, res) => {
  try {
    const { areaName, weather, quickfacts } = req.body;
    const image = req.files?.image ? `/uploads/${req.files.image[0].filename}` : '';
    const weatherIcon = req.files?.weatherIcon ? `/uploads/${req.files.weatherIcon[0].filename}` : '';

    let card = await Card.findOne();

    if (card) {
      card.areaName = areaName;
      card.weather = weather;
      card.quickfacts = quickfacts;
      if (image) card.image = image;
      if (weatherIcon) card.weatherIcon = weatherIcon;
      await card.save();
    } else {
      card = new Card({
        areaName,
        weather,
        quickfacts,
        image,
        weatherIcon
      });
      await card.save();
    }

    res.json({ message: 'Card updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while updating card' });
  }
});

module.exports = router;
