const moment = require('moment');

class DateHelper {

	constructor() {

		throw new Error('this class cannot be instantiated.')
		//pois se trata de uma classe que tem apenas métodos estáticos
  }

  static checkDateInRange(data, status, begin, end) {
    const selectedSchedules = []
    data.forEach((element) => {
      DateHelper.checkAtThisDay(element,status, begin, end, selectedSchedules);
      DateHelper.checkWeekly(element, status, begin, end, selectedSchedules);
      DateHelper.checkDaily(element, status, begin, end, selectedSchedules)
    });
    return selectedSchedules;
  }

  static checkAtThisDay(element, status, begin, end, selectedSchedules) {
    const beginDate = DateHelper.formatStringToDate(begin);
    const endDate = DateHelper.formatStringToDate(end);
    if (element.frequency.toLowerCase() === 'at this day' && element.status.toLowerCase() === status.toLowerCase()) {
      element.day = new Date(element.day);
      if (element.day <= endDate && element.day >= beginDate) {
        selectedSchedules.push(element)
      }
    }
  }

  static checkWeekly(element, status, begin, end, selectedSchedules) {
    const beginDate = DateHelper.formatStringToDate(begin);
    const endDate = DateHelper.formatStringToDate(end);
    if (element.frequency.toLowerCase() === 'weekly' && element.status.toLowerCase() === status.toLowerCase()) {
      const diffTime = Math.abs(beginDate - endDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const dates = [];
      for (let i = 0; i <= diffDays; i++) {
        dates.push(moment(beginDate).add(i, 'day'));
      }
      dates.forEach(dateDay => {
        if (dateDay.format('dddd').toLowerCase() === element.day.toLowerCase()) {
          selectedSchedules.push({
              frequency: 'at this day',
              day: dateDay.toDate(),
              interval: {
                start: element.interval.start,
                end: element.interval.end
              },
              status: element.status
            })
        }
      })
    }
  }

  static checkDaily(element, status, begin, end, selectedSchedules) {
    const beginDate = DateHelper.formatStringToDate(begin);
    const endDate = DateHelper.formatStringToDate(end);
    if (element.frequency.toLowerCase() === 'daily' && element.status.toLowerCase() === status.toLowerCase()) {
      const diffTime = Math.abs(beginDate - endDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const dates = [];
      for (let i = 0; i <= diffDays; i++) {
        dates.push(moment(beginDate).add(i, 'day'));
      }
      dates.forEach(dateDay => {
        selectedSchedules.push({
          frequency: 'at this day',
          day: dateDay.toDate(),
          interval: {
            start: element.interval.start,
            end: element.interval.end
          },
          status: element.status
        })
      })
    }
  }
  
  static formatDateToString(date) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (typeof(date) === 'object' && date !== null && !days.includes(date)){
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` 
    } else return date || null;
  }

  static formatStringToDate(string) {
    return new Date(string.split('-').reverse());
  }

}


module.exports = DateHelper;