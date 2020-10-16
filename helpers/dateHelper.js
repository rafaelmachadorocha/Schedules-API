class DateHelper {

	constructor() {

		throw new Error('this class cannot be instantiated.')
		//pois se trata de uma classe que tem apenas métodos estáticos
  }
  
  static formatDateToString(date) {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` 
  }

  static formatStringToDate(string) {
    return string.split('-').reverse();
  }

  static checkFrequency(frequency) {
    if (['daily', 'weekly'].includes(frequency)) return frequency;
    const newDate = DateHelper.formatStringToDate(frequency)
    console.log(newDate)
    return new Date(newDate);
  }

}




module.exports = DateHelper;