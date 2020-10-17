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
        selectedElement.intervals.sort((a, b) => Number.parseInt(a.start.match(/\d{2}/), 10) - Number.parseInt(b.start.match(/\d{2}/)), 10);
      }
    });
    return schedules.sort((a, b) => {
      DateHelper.formatStringToDate(a.day) - DateHelper.formatStringToDate(b.day);
    });
  }
}
module.exports = ScheduleHelper;