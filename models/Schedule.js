//const slugify = require('slugify');
const { json } = require('express');
const fs = require('fs');
const filePath = 'schedules.json';
const os = require('os');
const DateHelper = require('../helpers/dateHelper');

class Schedule {
  
  constructor(attributes = {}){
    this._id = 1;
    this.frequency = attributes.frequency || "at this day"
    this.day = (this.frequency === "at this day" ? new Date(DateHelper.formatStringToDate(attributes.day)) : null);
    this.interval = {
      start : attributes.interval.start,
      end : attributes.interval.end
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
            } else reject ([]);
          })
        } else {
          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (data !== undefined) {
              const newData = JSON.parse(data)
              resolve(Schedule.checkDateInRange(newData.schedules, begin, end))
            } else reject([])
          })
        }
    });
  }

  static checkDateInRange(data, begin, end) {
    const selectedSchedules = []
    const beginDate = new Date(DateHelper.formatStringToDate(begin));
    const endDate = new Date(DateHelper.formatStringToDate(end));
    data.forEach((element) => {
      if (element.frequency !== 'daily' && element.frequency !== 'weekly') {
        element.frequency = new Date(element.frequency);
        if (element.frequency <= endDate && element.frequency >= beginDate) {
          selectedSchedules.push(element)
        }
      }
    })
    return selectedSchedules;
  }

  save() {
    let body = {
      _id : 1,
      frequency : this.frequency,
      day : this.day,
      interval : {
        start : this.interval.start,
        end : this.interval.end
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
          const scheduleExists = element => (element.frequency === body.frequency || element.day === body.day) && 
                                            element.interval.start === body.interval.start && 
                                            element.interval.end === body.interval.end
          
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