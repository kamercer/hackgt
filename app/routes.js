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
        console.log('what');
        //var lat = req.body.lat;
        //var log = req.body.log;
        //var hours = req.body.hours;

        MongoClient.connect('mongodb://localhost/erasmus', function(err, db) {
            console.log(err);
            
            var potentialMarkers = [];
            
            var cursor = db.collection('historicalMarkers').find();
            

            cursor.toArray().then(function(docs){
                //console.log(docs.length);
                db.close(); 
                
                docs.forEach(function(doc, index){
                    var distance = geolib.getDistance({latitude : 33.778463, longitude : -84.398881}, {latitude : doc.LATITUDE, longitude : doc.LONGITUDE});

                    if((distance/1000) <= (2 * 5)){
                        potentialMarkers.push(doc);
                    }

                    //I now have a set of potential markers
                    console.log(potentialMarkers.length);

                   var current = [];
                   var working = [];

                   
                }); 
            });
        });
    });
};