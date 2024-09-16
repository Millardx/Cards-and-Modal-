// routes/modalRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Modal = require('../models/Modal');  // Import the Modal model

const router = express.Router();

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Unsupported file format'));
};

// Initialize upload variable for Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Set file size limit to 5MB
});

// GET route to fetch modal data
router.get('/', async (req, res) => {
  try {
    const modal = await Modal.findOne();  // Fetch one modal document
    if (!modal) return res.status(404).json({ error: 'No modal data found' });

    // Ensure modalImages is included in the response
    const responseData = {
      modalTitle: modal.title || '',  // Default to empty string if not present
      modalDescription: modal.description || '',  // Default to empty string if not present
      modalImages: [
        modal.image1 || null,
        modal.image2 || null,
        modal.image3 || null,
        modal.image4 || null,
        modal.image5 || null
      ].filter(image => image)  // Filter out null values
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching modal data:', error);
    res.status(500).json({ error: 'Server error while fetching modal data' });
  }
});



// Route for handling modal data including image uploads
// POST route to update or create modal data
router.post('/', upload.array('modalImages', 5), async (req, res) => {
  try {
    const { modalTitle, modalDescription } = req.body;
    if (!modalTitle || !modalDescription) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }
    const modalImages = req.files.map(file => file.path); // Get file paths from multer

    // Find the existing modal or create a new one
    let modal = await Modal.findOne();

    if (!modal) {
      modal = new Modal();  // Create a new instance if no modal is found
    }

    // Update modal fields
    modal.title = modalTitle;
    modal.description = modalDescription;
    modal.image1 = modalImages[0] || modal.image1;
    modal.image2 = modalImages[1] || modal.image2;
    modal.image3 = modalImages[2] || modal.image3;
    modal.image4 = modalImages[3] || modal.image4;
    modal.image5 = modalImages[4] || modal.image5;

    // Save the modal data
    await modal.save();

    res.json({ message: 'Modal data saved successfully' });
  } catch (error) {
    console.error('Error saving modal data:', error);
    res.status(500).json({ error: 'Server error while saving modal data' });
  }
});



module.exports = router;
