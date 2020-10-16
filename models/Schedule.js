//const slugify = require('slugify');
const { json } = require('express');
const fs = require('fs');
const filePath = 'schedules.json';
const os = require('os');
const DateHelper = require('../helpers/dateHelper');

class Schedule {
  
  constructor(attributes = {}){
    this._id = 1;
    this.frequency = DateHelper.checkFrequency(attributes.frequency)
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

 static find() {
  return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (data !== undefined) {
          const newData = JSON.parse(data);
          resolve(newData.schedules);
        } else reject ([]);
      })
  });
}

  save() {
    let body = {
      _id : 1,
      frequency : this.frequency,
      interval : {
        start : this.interval.start,
        end : this.interval.end
      }
    }
    this.formatData(body);
    return true
  }

  static async setId() {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (data === undefined) {
        return 1
      }
    });
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
          if (newData.schedules.length > 0 && newData.schedules.some((element) => { return element.frequency == body.frequency 
          && element.interval.start == body.interval.start 
          && element.interval.end == body.interval.end  })) {
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