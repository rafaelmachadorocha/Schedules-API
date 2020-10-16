const Schedule = require('../models/Schedule')
const DateHelper = require('../helpers/dateHelper');
const lodash = require('lodash')

// Get schedule rules => /api/v1/schedules
exports.getSchedules = async (req, res, next) => {

  const availableSchedules = await Schedule.find();
  res.status(200).json({
    success: true,
    results: availableSchedules.length,
    schedules: availableSchedules
  });
}

//Create a schedule rule => /api/v1/schedules/new
exports.newSchedule = async (req, res, next) => {
 const schedule = await Schedule.create(req.body);

  res.status(200).json({
    success: true,
    message: 'Schedule added',
    schedule: schedule
  })
}

//Search for avaiable schedules within range => /api/v1/schedules/:begin/:end
exports.getScheduleWithinRange = async (req, res, next) => {
  const { begin, end } = req.params
  const scheduleRules = await Schedule.find(begin, end)
  const schedules = {};
 
  
  res.status(200).json({
    success: true,
    results: scheduleRules.length,
    "available-schedules": scheduleRules
  });
}
