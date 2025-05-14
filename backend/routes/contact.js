const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Contact = require("../models/Contact");

// POST request for contact form
router.post(
  "/",
  // Validate fields
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("subject").not().isEmpty().withMessage("Subject is required"),
    body("message").not().isEmpty().withMessage("Message is required"),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    try {
      // Create a new contact message in the database
      const contact = new Contact({ name, email, subject, message });
      await contact.save();

      // Respond with success message
      res.status(201).json({ message: "Message sent successfully!" });
    } catch (err) {
      res.status(400).json({ error: "Failed to send message", details: err });
    }
  }
);

module.exports = router;
