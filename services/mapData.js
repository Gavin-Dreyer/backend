const Data = require("../assets/cache/pumps.json");
const PumpModel = require("../api/pumps/pumps.model");
const router = require("express").Router();
const knex = require("knex");
const config = require("../knexfile");
const db = require("../data/dbConfig");

// const getPumps = Data.pumps.map(pump => console.log("getPumps", pump))

const seedJSONSensors = () => {
  Data.pumps.map(data => {
    // console.log(data);
    const {
      id,
      finish_construction,
      well_depth,
      yield,
      static,
    } = data;
    const sensor = {
      physical_id: id,
      data_finished: finish_construction,
      depth: well_depth,
      yield: yield,
      static: static
    };
    addSensor(sensor);
    // console.log("sensor", sensor);
  });
};

seedJSONSensors()

const seedJSONPumps = () => {
    Data.pumps.map(data => {
      // console.log(data);
      const {
        id,
        latitude,
        longitude,
        village: { village, commune, district, province }
      } = data;
      const pump = {
        sensor_ID: id,
        latitude: latitude,
        longitude: longitude,
        country_name: village,
        commune_name: commune,
        district_name: district,
        province_name: province
      };
      addPump(pump);
    //   console.log("pump", pump);
    });
  };

  seedJSONPumps();

  
// "date": {
// "statuses": {
//     "date": "Thu Oct 24 2019",
//     "count": 109,
//     "total": 3219199,
//     "status": 2,
//     "pad_counts": [
   const seedJSONHistory = () => {
     Data.pumps.map(data => {
        console.log('current data map = ', data);
        // console.log("data statuses****", data.statuses)
        // console.log("data statuses.STATUSES****", data.statuses.statuses)
        // console.log(data.id, "this is data id")
        // console.log(data.statuses.statuses.count, "logging count")
        // if (data.statuses != undefined) {  
          // console.log(typeof data.statuses, "line 74 result")
      //  const {
      //    id,
      //    statuses: { statuses: {date = "", count = 0, total=  0, status = 0, padCounts = [], padSeconds = [], reportedPercent = ""}}} = data
      
    
  
       let history = {
         sensor_id: data.id,
         count: data.statuses.statuses.count,
         total: data.statuses.statuses.total,
         status: data.statuses.statuses.status,
         date: data.statuses.statuses.date,
        pad_counts: JSON.stringify([data.statuses.statuses.pad_counts[0], data.statuses.statuses.pad_counts[1], data.statuses.statuses.pad_counts[2], data.statuses.statuses.pad_counts[3]]),
        pad_seconds: JSON.stringify([data.statuses.statuses.pad_seconds[0], data.statuses.statuses.pad_seconds[1], data.statuses.statuses.pad_seconds[2], data.statuses.statuses.pad_seconds[3]]),
        reported_percent: data.statuses.statuses.reported_percent
       } 

       console.log("HISTORY", history)
      
       addHistory(history);
      // } else {
      //   // console.log(typeof data.statuses.statuses, "line 93 result")
      //    const {
      //      id
      //    } = data
      //    let history = {
      //      sensor_id: data.id,
      //     //  statuses: {}
        
      //    }
      //    addHistory(history);

      //  }
      //addHistory(history);
     // console.log("history", history);
     })
   };

  seedJSONHistory()

function addPump(pump) {
  return db("pumps")
    .insert(pump)
    .returning("id")
    .then(res => {
      console.log(res);
    });
}

function addSensor(sensor) {
    return db("sensors")
      .insert(sensor)
      .returning("id")
      .then(res => {
        console.log(res);
      });
  }

  function addHistory(history) {
    return db("history")
      .insert(history)
      .returning("id")
      .then(res => {
        console.log(res);
      });
  }

//seedJSONHistory,
module.exports = seedJSONPumps, seedJSONHistory, seedJSONSensors;
