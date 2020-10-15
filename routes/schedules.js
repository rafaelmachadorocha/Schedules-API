const express = require('express');
const router = express.Router();

const { getSchedules, newSchedule } = require('../controllers/schedulesController');

router.route('/schedules').get(getSchedules);

router.route('/schedules/new').post(newSchedule);

module.exports = router;