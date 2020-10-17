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
        if(!selectedElement.intervals.some(element => element.start === rule.interval.start && 
           element.end === rule.interval.end)) {
            selectedElement.intervals.push({ start: rule.interval.start, end: rule.interval.end });
        }
        selectedElement.intervals.sort((a, b) => a.start - b.start);
      }
    });
    return schedules.sort((a, b) => {
      new Date(DateHelper.formatStringToDate(a.day)) - new Date(DateHelper.formatStringToDate(b.day));
    });
  }
}
module.exports = ScheduleHelper;