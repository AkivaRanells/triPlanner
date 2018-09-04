const express = require('express');
const router = express.Router();

// 1. Handle getting all posts and their comments
router.get('/trips', (req, res) => {
    res.send('hi 😊');
});

module.exports = router;