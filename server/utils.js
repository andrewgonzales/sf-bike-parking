var fs = require('fs');
var request = require('request');
var Space = require('../db/models/space');
exports.endpoint = 'https://data.sfgov.org/resource/w969-5mn4.json?$limit=3000';

exports.data = {};
exports.saveData = function() {
  request(exports.endpoint, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body);
      spaces = [];
      for (var i = 0; i<body.length; i++){

        var newSpace = new Space({
          id: i,
          address: body[i].yr_inst,
          racks: body[i].racks,
          spots: body[i].spaces,
          coords: {latitude: Number(body[i].latitude.latitude), longitude: Number(body[i].latitude.longitude)}
        });
      
        newSpace.save(function(err,space){
          if (err){
            response.send(500);
          } else {
            // response.send(200, space);
          }
        });
      }

      exports.data = body;
    }
  });
};

exports.loadFromDB = function (req, res) {
  Space.find({}).exec(function(err, results) {
    if (err) {console.error(err);}
    res.status(200).send(results);
    var display = results.slice(0,3);
  });
};

