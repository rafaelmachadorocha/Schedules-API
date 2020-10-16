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
  const schedules = [];

  scheduleRules.forEach(function (rule) {
    const formattedDate = DateHelper.formatDateToString(rule.day);
    if (!schedules.some(element => element['day'] === formattedDate)) {
      schedules.push({ day: formattedDate, intervals: [{ "start": rule.interval.start, "end": rule.interval.end }] });
    } else {
      const selectedElement = schedules.find(element => element['day'] === formattedDate);
      selectedElement.intervals.push({ start: rule.interval.start, end: rule.interval.end });
    }
    });

  res.status(200).json({
    success: true,
    results: schedules.length,
    "available-schedules": schedules
  });
}
