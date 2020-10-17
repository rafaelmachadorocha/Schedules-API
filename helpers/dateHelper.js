class DateHelper {

	constructor() {

		throw new Error('this class cannot be instantiated.')
		//pois se trata de uma classe que tem apenas métodos estáticos
  }
  
  static formatDateToString(date) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (typeof(date) === 'object' && date !== null && !days.includes(date)){
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` 
    } else return date || null;
  }

  static formatStringToDate(string) {
    return string.split('-').reverse();
  }

}


module.exports = DateHelper;