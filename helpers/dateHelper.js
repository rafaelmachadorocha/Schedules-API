class DateHelper {

	constructor() {

		throw new Error('this class cannot be instantiated.')
		//pois se trata de uma classe que tem apenas métodos estáticos
  }
  
  static formatDateToString(date) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!days.includes(date) && date !== null){
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` 
    } else return date || null
  }

  static formatStringToDate(string) {
    return string.split('-').reverse();
  }

}


module.exports = DateHelper;