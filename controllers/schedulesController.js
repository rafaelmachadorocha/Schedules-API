const Schedule = require('../models/Schedule');
const ScheduleHelper = require('../helpers/scheduleHelper');

// Get schedule rules => /api/v1/schedules
exports.getSchedules = (req, res, next) => {
  const availableSchedules = Schedule.find();
  availableSchedules
  .then((value) => {
    res.status(200).json({
      success: true,
      results: value.length,
      schedules: value
    });
  })
  .catch((reason) => {
    res.status(500).json({
      success: false,
      results: reason.length,
      schedules: reason
    })
  })
}

//Search for avaiable schedules within range => /api/v1/schedules/:begin/:end/:status
exports.getScheduleWithinRange = (req, res, next) => {
  const { begin, end, status } = req.params
  const scheduleRules = Schedule.find(status, begin, end)
  scheduleRules
  .then((value) => {
    const schedules = ScheduleHelper.filterSchedules(value);
    res.status(200).json({
      success: true,
      results: schedules.length,
      schedules: schedules
    });
  })
  .catch((reason) => {
    res.status(200).json({
      sucess: false,
      results: reason.length,
      schedules: reason
    })
  })
  
 
}

//Create a schedule rule => /api/v1/schedules/new
exports.newSchedule = async (req, res, next) => {
  const response = await Schedule.create(req.body);
  if(typeof(response) === 'object') {
  res.status(200).json({
    success: true,
    message: 'Schedule added',
    schedule: response
  });
  } else res.status(500).json({
    sucess: false,
    message: response
  })  
};

//Delete an specific schedule rule => api/v1/job/:id
exports.deleteSchedule = (req, res, next) => {
  const schedule = Schedule.findByIdAndDelete(req.params.id)
  schedule.then((value) => res.status(200).json({
    success: true,
    message: 'Schedule is deleted',
    removedSchedule: value
  })).catch((reason) => res.status(404).json({
    sucess: false,
    message: reason
  }))
}

