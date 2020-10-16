const Schedule = require('../models/Schedule')

// Get schedules => /api/v1/schedules
exports.getSchedules = async (req, res, next) => {

  const availableSchedules = await Schedule.find();
  res.status(200).json({
    success: true,
    results: availableSchedules.length,
    schedules: availableSchedules
  });
}

exports.newSchedule = async (req, res, next) => {
 const schedule = await Schedule.create(req.body);

  res.status(200).json({
    success: true,
    message: 'Schedule added',
    schedule: schedule
  })
}
