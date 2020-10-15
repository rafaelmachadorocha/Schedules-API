const express = require('express');
const router = express.Router();

router.get('/schedules', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This route will display schedules'
  });
});

module.exports = router;