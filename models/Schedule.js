//const slugify = require('slugify');
const { json } = require('express');
const fs = require('fs');
const filePath = 'schedules.json';
const os = require('os');
const DateHelper = require('../helpers/dateHelper');

class Schedule {
  
  constructor(attributes = {}){
    this.slug = new String("");
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
      resolve("Schedule sucessful created");
    } else reject("Couldn't create schedule");
  });
}

  async save() {
    let body = {
      frequency : this.frequency,
      interval : {
        start : this.interval.start,
        end : this.interval.end
      }
    }
    await fs.readFile(filePath, (error, content) => {
      let data = JSON.parse(content);
      if(!data.hasOwnProperty('schedules')) {
        data['schedules'] = [];
      }
      if (data.schedules.length > 0) {
        if (data.schedules.some((element) => { return element.frequency == body.frequency && element.interval.start == body.interval.start && element.interval.end == body.interval.end  })) {
          console.log("schedule already exists");
          return false;
        }
      }
      data['schedules'].push(body)
      const newData = JSON.stringify(data);
      fs.writeFile(filePath, newData, () => {
      })
    });
  }
} 

module.exports = Schedule;