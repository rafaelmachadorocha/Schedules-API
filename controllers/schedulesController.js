const Schedule = require('../models/Schedule')
const DateHelper = require('../helpers/dateHelper');

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
  
  const schedules = await Schedule.find(begin, end)
  const formattedSchedules = schedules.map((element) => {
    if (typeof(element.frequency) === 'object') {
      element.frequency = DateHelper.formatDateToString(element.frequency);
      return {
        day: element.frequency,
        interval: {start: element.interval.start, end: element.interval.end}
      }
    }
  }) 
  res.status(200).json({
    success: true,
    results: formattedSchedules.length,
    "avaiable-schedules": formattedSchedules
  });
}
