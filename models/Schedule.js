const { json } = require('body-parser');
const fs = require('fs');
const filePath = 'schedules.json';
const DateHelper = require('../helpers/dateHelper');

class Schedule {
  
  constructor(attributes = {}){
    this._id = 1;
    this.frequency = attributes.frequency || "at this day"
    this.day = Schedule.setDate(this.frequency, attributes.day)
    this.interval = {
      start: attributes.interval.start,
      end: attributes.interval.end
    };
  }


  static create(body) {
    return new Promise((resolve, reject) => {
      const schedule = new Schedule(body);
      if(schedule.save()) {
        resolve(body);
      } else reject("Couldn't create schedule");
  });
 }


  static find(begin = null, end = null) {
    return new Promise((resolve, reject) => {
        if (!begin || !end){
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (data !== undefined) {
              const newData = JSON.parse(data);
              resolve(newData.schedules);
            } 
            reject ([]);
          })
        } else {
          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (data !== undefined) {
              const newData = JSON.parse(data)
              resolve(Schedule.checkDateInRange(newData.schedules, begin, end))
            } 
            reject([])
          })
        }
    });
  }

  static findByIdAndDelete(id) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (data === undefined) {
          reject(undefined);
        }
        const obj = JSON.parse(data);
        const { schedules } = obj;
        const schedule = schedules.find(element => element._id.toString() === id);
        const index = schedules.indexOf(schedule);
        const removedSchedule = schedules.splice(index, 1);
        const newData = JSON.stringify(schedules);
        fs.writeFile(filePath, newData, (err) => {
          if (err) throw err;
          resolve(removedSchedule);
        })
      });
    })
  }

  static setDate(frequency, date) {
    if (frequency === "at this day") {
      return new Date(DateHelper.formatStringToDate(date));
    } else if (frequency === "weekly") {
      return date;
    } return null;
  }

  static checkDateInRange(data, begin, end) {
    const selectedSchedules = []
    const beginDate = new Date(DateHelper.formatStringToDate(begin));
    const endDate = new Date(DateHelper.formatStringToDate(end));
    data.forEach((element) => {

      if (element.frequency === 'at this day') {
        element.day = new Date(element.day);
        if (element.day <= endDate && element.day >= beginDate) {
          selectedSchedules.push(element)
        }
      }
    })
    return selectedSchedules;
  }

  save() {
    let body = {
      _id: 1,
      frequency : this.frequency,
      day: this.day,
      interval: {
        start: this.interval.start,
        end: this.interval.end
      }
    }
    this.formatData(body);
    return true
  }

  async formatData(body) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (data === undefined) {
        let newData = {};
        body._id = 1;
        newData['schedules'] = [];
        newData['schedules'].push(body);
        newData = JSON.stringify(newData)
        fs.writeFile(filePath, newData, (err) => {
          if (err) throw err;
        }); 
      } else {
          let newData = JSON.parse(data);
          if(!newData.hasOwnProperty('schedules')) {
            newData['schedules'] = [];
          }
          const scheduleExists = element =>{
            return ((element.frequency !== "at this day" && element.frequency === body.frequency) || 
                     (DateHelper.formatDateToString(new Date(element.day)) === DateHelper.formatDateToString(body.day)) || body.day === element.day) && 
                     element.interval.start === body.interval.start && 
                     element.interval.end === body.interval.end


          } 
          
          if (newData.schedules.length > 0 && newData.schedules.some(scheduleExists)) {
            throw new Error("Schedule already exists");
          }
          const schedules =  newData['schedules']
          body._id = schedules[schedules.length - 1]._id + 1
          newData['schedules'].push(body)
          newData = JSON.stringify(newData)
          fs.writeFile(filePath, newData, (err) => {
            if (err) throw err;
          });         
        } 
    });
  }
} 

module.exports = Schedule;