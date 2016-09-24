var geolib = require("geolib");
var mongoose = require("mongoose");

var MongoClient = require('mongodb').MongoClient;

var hist = mongoose.model('historicalMarker',new mongoose.Schema({}, {strict : false}));

module.exports = function(app){
    
    //index page
    app.get('/', function(req, res){
        res.sendFile('/views/index.html', {root: __dirname + '/../public'});
    });


    app.get('/results', function(req, res){
        console.log('this ran');
        //var lat = req.body.lat;
        //var log = req.body.log;
        //var hours = req.body.hours;

        MongoClient.connect('mongodb://localhost/S1', function(err, db) {
            console.log(err);
            
            var cursor = db.collection('historicalMarker').find();
                cursor.each(function(err, docs) {
                
                console.log(err);
                console.log(docs);

                db.collection('historicalMarker').save({"name" : "no"});
                if (docs !== null) {
                    
                } else {
                    
                }
            });
        });
    });

    
};