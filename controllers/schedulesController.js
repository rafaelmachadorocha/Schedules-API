const Schedule = require('../models/Schedule')
const DateHelper = require('../helpers/dateHelper');
const ScheduleHelper = require('../helpers/scheduleHelper');

// Get schedule rules => /api/v1/schedules
exports.getSchedules = async (req, res, next) => {

  const availableSchedules = await Schedule.find();
  res.status(200).json({
    success: true,
    results: availableSchedules.length,
    schedules: availableSchedules
  });
}

//Search for avaiable schedules within range => /api/v1/schedules/:begin/:end
exports.getScheduleWithinRange = async (req, res, next) => {
  const { begin, end } = req.params
  const scheduleRules = await Schedule.find(begin, end)
  const schedules = ScheduleHelper.filterAvailableSchedules(scheduleRules);
  res.status(200).json({
    success: true,
    results: schedules.length,
    "available-schedules": schedules
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

//Delete an specific schedule rule => api/v1/job/:id
exports.deleteSchedule = async (req, res, next) => {
  let schedule = await Schedule.findByIdAndDelete(req.params.id)
  if(!schedule) {
    return res.status(404).js({
      success: false,
      message: 'Schedule not found.'
    })
  }

  //schedule = await schedule.remove()
  res.status(200).json({
    success: true,
    message: 'Schedule is deleted',
    removedSchedule: schedule
  })
}

