const DateHelper = require('./dateHelper');
class ScheduleHelper {
  static filterSchedules(scheduleRules) {
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
    return schedules;
  }
}
module.exports = ScheduleHelper;