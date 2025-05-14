const Contact = require('../models/Contact');

// Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

// Get all contact submissions (optional)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
};
