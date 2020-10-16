const express = require('express');
const router = express.Router();

const { getSchedules, newSchedule, getScheduleWithinRange } = require('../controllers/schedulesController');

router.route('/schedules').get(getSchedules);

router.route('/schedules/:begin/:end').get(getScheduleWithinRange);

router.route('/schedules/new').post(newSchedule);

module.exports = router;