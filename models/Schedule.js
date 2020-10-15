//const slugify = require('slugify');
const { json } = require('express');
const fs = require('fs');
const filePath = 'schedules.json';
const os = require('os');
const { formatWithOptions } = require('util');

class Schedule {
  
  constructor(attributes = {}){
    this._id = Schedule.incrementId();
    this.slug = new String("");
    this.date = new Date(attributes.date);
    this.interval = {
      start :  new String(attributes.interval.start),
      end :  new String(attributes.interval.end)
    };
    
  }

  static incrementId() {
    if (!this.latestId) this.latestId = 1
    else this.latestId++
    return this.latestId
  }

  static create(body) {
    return new Promise((resolve, reject) => {
      console.log(body)
     const schedule = new Schedule(body);
     if(schedule.save()) {
       resolve("Schedule sucessfull created");
     } else reject("Couldn't create schedule");
  });
}

  async save() {
  
    let body = {
      date : this.date,
      interval : {
        start : this.interval.start.normalize(),
        end : this.interval.end.normalize()
      }
    }
    body = JSON.stringify(body)
    if (!filePath) {
      console.log("sem file")
      await fs.writeFile(filePath, body, (err) => {
        if (err) throw err;
      })
    } else {
      console.log("com file")
      await fs.appendFile(filePath, body + os.EOL, (err) => {
        if (err) throw err;
      })
    }
  }
} 
module.exports = Schedule;