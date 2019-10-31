const Data = require("../assets/cache/pumps.json");
const PumpModel = require("../api/pumps/pumps.model");
const router = require("express").Router();
const knex = require("knex");
const config = require("../knexfile");
const db = require("../data/dbConfig");


// const getPumps = Data.pumps.map(pump => console.log("getPumps", pump))

let target = {
    "id": 13,
    "date": "Sun Oct 27 2019",
    "count": 112,
    "total": 4129758402,
    "status": 2,
    "sensor_id": 4715,
    "pad_seconds": "[2928,3625,1830,276]",
    "pad_counts": "[26,28,25,13]",
    "reported_percent": 0.3888888888888889 
}


const getCurrentPumpDate = Data.pumps.filter(item => item.statuses != undefined).filter(item => item.statuses.statuses)[0].statuses.statuses.date
console.log(getCurrentPumpDate)

const seedJSONSensors = () => {

  
  Data.pumps.forEach((data, idx) => {

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


    const seedJSONHistory = () => {
      Data.pumps.forEach((data, idx) => {
      if (data.statuses) {
        let history = {
         sensor_id: data.id,
         count: data.statuses.statuses ? data.statuses.statuses.count : 0,
         total: data.statuses.statuses ? data.statuses.statuses.total : 0,
         status: data.statuses.statuses ? data.statuses.statuses.status : 0,
         date: data.statuses.statuses ? data.statuses.statuses.date : "",
         reported_percent: data.statuses.statuses ? data.statuses.statuses.reported_percent : 0
        }  
        // addHistory(history)
        addStatus(history)
       } else {console.log(`error in sensor_id: ${data.id}, no statuses property`)}})
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

        // addStatus(history);
      });
  }

  function addCounts(counts) {
    return db("counts")
    .insert(counts)
  }

  function addSeconds(seconds) {
    return db("pad_seconds")
    .insert(seconds)
  }

  function getHistoryFilter(filter) {
    return db("history")
    .where(filter)

    
  }

  function addStatusTest(filter) {
    try {
    return db("history")
    .where(filter)
    .first()
    } catch (err) {
      console.log(err.message)

    }
  }

  function addPadCounts(counts) {
    return db("pad_counts")
      .insert(counts)
      .returning("id")
      .then(res => {
        console.log(res);
      });
  }

  function addPadSeconds(seconds) {
    return db("pad_seconds")
      .insert(seconds)
      .returning("id")
      .then(res => {
        console.log(res);
      });
  }

  function padCountById(id) {
    return db("pad_counts")
    .where({id})
    .first()
  }
  // function addStatus (history){	  
  //   // db.transaction(function(trx) {	   
  //   return db("history").insert(history, "id")
  //     .then(([id]) => {	
  //       const getPadCounts = Data.pumps.forEach((data, idx) => {
  //         if (data.id === history.sensor_id) {
  //           const cleanData = Data.pumps.filter(item => item.id === history.sensor_id)          
  //                 const getPadCounts = cleanData[0].statuses.statuses.pad_counts.map(item => {
  //                   let current = {
  //                   history_id: id,
  //                   counts: item
  //                   }
  //                   addPadCounts(current)
  //                 })	
  //                 const getPadSeconds = cleanData[0].statuses.statuses.pad_seconds.map(item => {
  //                   let current = {
  //                   history_id: id,
  //                   seconds: item
  //                   }
  //                   addPadSeconds(current)
  //                 })
  //               }})
  //             })
  //           //})
  //         }

  function getPadCountHistory(id) {
    return db("pad_counts")
    .where({history_id: id})
    .first()

  }

  function updatePadCounts(current, id) {
    return db("pad_counts")
      .where({ history_id: id })
      .update(current)
      .then(res => {
        console.log(res, "this is line 217")
      })
      // return getPadCountHistory(id)

  }

  function updatePadSeconds(current, id) {
    return db("pad_seconds")
      .where({ history_id: id })
      .update(current)
      .then(res => {
        console.log(res, "this is line 228")
      })
      

  }

  

  function addStatus (history){	  
    // db.transaction(function(trx) {	   
    return db("history").insert(history, "id")
      .then(([id]) => {	
        const getPadCounts = Data.pumps.forEach((data, idx) => {
          if (data.id === history.sensor_id) {
            
            const cleanData = Data.pumps.filter(item => item.id === history.sensor_id) 
            if (cleanData[0].statuses.statuses === undefined) {
              console.log(`no statuses associated with sensor id ${history.sensor_id}`)
            } else {
              let count1 = 0
              let count2 = 0        
                  const getPadCounts = cleanData[0].statuses.statuses.pad_counts.map(item => {
                    if(count1 === 0) {
                      let current = {
                        history_id: id,
                        [`count_${count1}`]: null ? item : item,
                      }
                      count1++
                      addPadCounts(current)
                  } else if (count1 < 4) {
                    console.log(item, "this is item 249")
                    let current = {
                        history_id: id,
                        [`count_${count1}`]: null ? item : item,
                      }
                      count1++
                      console.log(current, "this is line 254 current")
                      updatePadCounts(current, id)
                  } 
                      else {
                        count1 = 0
                      }})	
            const getPadSeconds = cleanData[0].statuses.statuses.pad_seconds.map(item => {
              if(count2 === 0) {
                let current = {
                  history_id: id,
                  [`seconds_${count2}`]: null ? item : item,
                }
                count2++
                addPadSeconds(current)
            } else if (count2 < 4) {
              console.log(item, "this is item 273")
              let current = {
                  history_id: id,
                  [`seconds_${count2}`]: null ? item : item,
                }
                count2++
                console.log(current, "this is line 279 current")
                updatePadSeconds(current, id)
            } 
                else {
                  count2 = 0
                }})	
                }}})
              })
            //})
          }

  // function addStatus (history){	  
  //   // db.transaction(function(trx) {	   
  //   return db("history").insert(history, "id")
  //     .then(([id]) => {	
  //       const getPadCounts = Data.pumps.forEach((data, idx) => {
  //         if (data.id === history.sensor_id) {
            
  //           const cleanData = Data.pumps.filter(item => item.id === history.sensor_id)  
  //             let count1 = 0
  //             let count2 = 0        
  //                 const getPadCounts = cleanData[0].statuses.statuses.pad_counts.map(async item => {
                    
                    
  //                   if(count1 === 0) {
  //                     console.log(count1, "line 231")
  //                   let current = {
  //                   history_id: id,
  //                   [`count_${count1}`]: null ? item : item,
  //                   }
  //                   count1++
  //                   addPadCounts(current)
  //                   console.log(current, "zero")
  //                 } else if (count1 === 1) {
  //                   console.log(count1, "line 239")
  //                   let current = {
  //                     history_id: id,
  //                     [`count_${count1}`]: null ? item : item,
  //                     }
  //                     console.log(id, "this is line 244")
  //                     count1++
  //                     updatePadCounts(current, id)
  //                     console.log(current, "one")

  //                 } else if (count1 === 2) {
  //                   console.log(count1, "line 249")
  //                   let current = {
  //                     history_id: id,
  //                     [`count_${count1}`]: null ? item : item,
  //                     }
  //                     console.log(id, "this is line 254")
  //                     count1++
  //                     updatePadCounts(current, id)
  //                     .then (res => {console.log(res, "result line 259")})
  //                     console.log(current, "two")
  //                   }
  //                     else if (count1 === 3) {
  //                       console.log(count1, "line 258")
  //                       let current = {
  //                         history_id: id,
  //                         [`count_${count1}`]: null ? item : item,
  //                         }
  //                         console.log(id, "this is line 263")
  //                         count1++
  //                         try {
  //                           const update = await updatePadCounts(current, id)
  //                           console.log(update, "update line 272")
  //                         console.log(current, "three")
  //                       } catch (err) {
  //                         console.log(err, "this is the error line 274")
  //                       }
  //                     }
  //                     else {count1 = 0}})	
  //                 const getPadSeconds = cleanData[0].statuses.statuses.pad_seconds.map(item => {
                    
  //                   if(count2 < 4) {
  //                   let current = {
  //                   history_id: id,
  //                   [`seconds_${count2}`]: item,
  //                   }
  //                   count2++
  //                   addPadSeconds(current)
  //                 }else {count2 = 0}})
  //               }})
  //             })
  //           //})
  //         }

        
  // function addStatus (status){
  //   db.transaction(function(trx) {
  //     db.insert(status, "id").then(([id]) => {
  //       const padCounts = status.padCounts.map(p => {
  //         return {
  //           statuses_id: id,
  //           ...p
  //         }
  //       });
  //       const padSeconds = status.padSeconds.map(s => {
  //         return {
  //           statuses_id: id,
  //           ...s
  //         }
  //       });
  //       const insertCounts = knex.insert(padCounts).into("padCounts");
  //       const insertSeconds = knex.insert(padSeconds).into("padSeconds");
  //       const promises = [insertCounts, insertSeconds]
  
  //       return Promise.all(promises).then(results => {
  //         const {counts, seconds} = results;
  //         return id;
  //       })
  
  //     })
  //       .then(trx.commit)
  //       .catch(trx.rollback);
  
  //   })
  //   .then(function(inserts) {
  //     console.log(inserts.length + ' statuses');
  //   })
  //   .catch(function(error) {
  //     // If we get here, that means that neither the 'Old Books' catalogues insert,
  //     // nor any of the books inserts will have taken place.
  //     console.error(error);
  //   });
  // }



// function addStatus (history){	  
//   // const id = history.sensor_id	  
//   db.transaction(function(trx) {	   
//   return db("history").insert(history, "id")
//     .then(([id]) => {	
//       console.log("********line 180", id)
//       const getPadCounts = Data.pumps.forEach((data, idx) => {
//         if (data.sensor_id === history.sensor_id) {
        
//                 const getPadCounts = data.statuses.statuses.pad_counts.map(item => {
//                   let current = {
//                   history_id: id,
//                   counts: item
//                   }
//                   console.log(current, "this is current")
//                   addPadCounts(current, console.log("help"))
//                 })	
//               }})
      // const getPadSeconds = Data.pumps.map(data => {	
      //   console.log("********line 192", data.statuses.statuses.pad_seconds)

      //   let current = {	
      //     history_id: id,	
      //     seconds: data.statuses.statuses.pad_seconds
      //   }	
      //  console.log(current, "current seconds line 198")
      // });	

//       const insert_counts = db.insert(getPadCounts).into("pad_counts");	
//       // const insert_seconds = db.insert(getPadSeconds).into("pad_seconds");	
//       console.log(insert_counts, "this is insert counts")
//       const promises = [insert_counts]	
//       console.log("********line 205")
//             console.log(promises, "this is promises")
//       return Promise.all(promises).then(results => {	
//         console.log("this is line 248")
//         const {counts} = results;	
//         return id;	
//       })	


//     })	
//       .then(trx.commit)	
//       .catch(trx.rollback);	


//   })	  
//   .then(function(inserts) {	
//     console.log(inserts.length + ' statuses');	
//   })	
//   .catch(function(error) {	
//     // If we get here, that means that neither the 'Old Books' catalogues insert,	
//     // nor any of the books inserts will have taken place.	
//     console.error(error);	
//   });	
// }
 
        
module.exports = seedJSONPumps, seedJSONSensors, seedJSONHistory;
