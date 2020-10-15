const Schedule = require('../models/Schedule')

// Get schedules => /api/v1/schedules
exports.getSchedules = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'This route will display schedules'
  });
}

exports.newSchedule = async (req, res, next) => {
  const schedule = await Schedule.create(req.body);
  console.log(schedule)
  res.status(200).json({
    success: true,
    message: 'Schedule added',
    data: schedule
  })
}