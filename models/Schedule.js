const fs = require('fs');
const filePath = 'schedules.json';
const DateHelper = require('../helpers/dateHelper');

class Schedule {
  
  constructor(attributes = {}){
    this._id = 1;
    this.frequency = attributes.frequency || "at this day";
    this.day = Schedule.setDate(this.frequency, attributes.day);
    this.status = attributes.status;
    this.interval = {
      start: attributes.interval.start,
      end: attributes.interval.end
    };
  }

  static find(status = null, begin = null, end = null) {
    return new Promise((resolve, reject) => {
        if (!begin || !end || !status){
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (data !== undefined) {
              const newData = JSON.parse(data);
              resolve(newData.schedules);
            } else reject([])
          })
        } else {
          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (data !== undefined) {
              const newData = JSON.parse(data);
              resolve(DateHelper.checkDateInRange(newData.schedules, status, begin, end))
            } else reject([])
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
        if (index >= 0) {
          
          const removedSchedule = schedules.splice(index, 1);
          const newData = JSON.stringify({schedules: [...schedules]});
          fs.writeFile(filePath, newData, (err) => {
            if (err) throw err;
            resolve(removedSchedule);
          })
        } else reject("Could't find the selected schedule") 
      });
    })
  }

  static setDate(frequency, date) {
    if (frequency === "at this day") {
      return DateHelper.formatStringToDate(date);
    } else if (frequency === "weekly") {
      return date;
    } return null;
  }

  static create(body) {
    const schedule = new Schedule(body);
    return schedule.save().then(v => v, r => r);
  };

  save() {
    let body = {
      _id: 1,
      frequency : this.frequency,
      day: this.day,
      interval: {
        start: this.interval.start,
        end: this.interval.end
      },
      status: this.status
    }
    return this.formatData(body).then(v => v, r => r);
  }
  
  formatData(body) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', async (err, data) => {
        if (data === undefined) {
          let newData = {};
          body._id = 1;
          newData['schedules'] = [];
          newData['schedules'].push(body);
          newData = JSON.stringify(newData);
          fs.writeFile(filePath, newData, (err) => {
            if (err) throw err;
            resolve(body);
          }); 
        } else {
            let newData = JSON.parse(data);
            const schedules = newData['schedules'];
            body._id = schedules[schedules.length - 1]._id + 1;
            newData['schedules'].push(body);
            newData = JSON.stringify(newData);
            fs.writeFile(filePath, newData, (err) => {
              if (err) reject(err);
              resolve(body);
            });        
          }        
      });  
    })
  }
} 

module.exports = Schedule;