const express = require('express');
const router = express.Router();

const { getSchedules, newSchedule, getScheduleWithinRange, deleteSchedule } = require('../controllers/schedulesController');

router.route('/schedules').get(getSchedules);

router.route('/schedules/:begin/:end/:status').get(getScheduleWithinRange);

router.route('/schedules/new').post(newSchedule);

router.route('/schedule/:id').delete(deleteSchedule);

module.exports = router;