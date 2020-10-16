class DateHelper {

	constructor() {

		throw new Error('this class cannot be instantiated.')
		//pois se trata de uma classe que tem apenas métodos estáticos
  }
  
  static formatDateToString(date) {

  }

  static formatStringToDate(string) {
    return string.split('-').reverse();
  }

  static checkFrequency(frequency) {
    if (!['daily', 'weekly'].includes(frequency)) return frequency;
    return new Date(formatStringToDate(frequency));
  }

}




module.exports = DateHelper;