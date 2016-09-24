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
        var lat = req.query.lat;
        var log = req.query.log;
        var hours = req.query.hours;

        MongoClient.connect('mongodb://localhost/erasmus', function(err, db) {
            console.log(err);
            
            var potentialMarkers = [];
            
            var cursor = db.collection('historicalMarkers').find({"CONDITION" : 1});
            

            cursor.toArray().then(function(docs){
                console.log(docs.length);
                db.close(); 
                
                docs.forEach(function(doc, index){
                    var distance = geolib.getDistance({latitude : 33.778463, longitude : -84.398881}, {latitude : doc.LATITUDE, longitude : doc.LONGITUDE});

                    if((distance) <= (2 * 5000)){
                        potentialMarkers.push(doc);
                    }
                }); 

                //I now have a set of potential markers
                console.log(potentialMarkers.length);
                //console.log(potentialMarkers.splice(0, 4));

                    
                var start = (new Date).getTime();
                var current = getGood(potentialMarkers.splice(0, 50), [], [], (2 * 5000));
                var end = (new Date).getTime();

                console.log("seconds: " + (end-start)/1000); 

                
                console.log('/////////////////////////////////////////////////');
                
                for(var i = 0; i < current.length; i++){
                    console.log(current[i].LATITUDE + ", " + current[i].LONGITUDE)
                }

                console.log(addUp(current)/1000);
                res.end();
            });
        });
    });
};

function getGood(potentialMarkers, current, working, limit){
    
    //check if I need to return home
    var distanceToHome;
    if(working.length > 0){
        var currentLocation = working[working.length-1];
        distanceToHome = geolib.getDistance({latitude : 33.778463, longitude : -84.398881}, {latitude : currentLocation.LATITUDE, longitude : currentLocation.LONGITUDE});
        //distanceToHome = distanceToHome/1000;
        //console.log(distanceToHome);
    }else{
        distanceToHome = 0;
    }
        
    for(var i = 0; i < potentialMarkers.length; i++){
        
        working.push(potentialMarkers[i]);

        var temp = null;

        //true - if the current route + new location is greater than specified time
        if(addUp(working)+distanceToHome > limit || potentialMarkers.length === 0){
            //console.log('hit : ' + addUp(working) + " | " + (addUp(working)+distanceToHome));
            if(addUp(working) > addUp(current)){
                temp = working;
            }else{        
                temp = current;
            }
        }else{
            temp = getGood(potentialMarkers.slice(i+1), current.slice(0), working.slice(0), limit);
        }
            
            
        //console.log('calling new method: ' + potentialMarkers.length + " | " + working.length + " | " + i);
            
        //console.log('old method: ' + potentialMarkers.length + " | " + temp.length);
        //console.log(temp);
        working.pop();
            
        //console.log(geolib.getDistance({latitude : 33.778463, longitude : -84.398881}, {latitude : temp[0].LATITUDE, longitude : temp[0].LONGITUDE}));
           
        if(addUp(temp) > addUp(current) && addUp(temp) <= limit && temp.length > current.length){
            current = temp;
        }
        //console.log('end: ' + current.length + " | " + addUp(current));
        //console.log('this ran : ' + potentialMarkers.length + " | " + i);
            
    }

    return current;
    
}

//returns kilometers
function addUp(current){
    var distance = 0;

    if(current.length > 0){
        distance = distance + geolib.getDistance({latitude : 33.778463, longitude : -84.398881}, {latitude : current[0].LATITUDE, longitude : current[0].LONGITUDE});
    }

    for(var i = 1; i < current.length; i++){
        distance = distance + geolib.getDistance({latitude : current[i-1].LATITUDE, longitude : current[i-1].LONGITUDE}, {latitude : current[i].LATITUDE, longitude : current[i].LONGITUDE});
        
}

    //return distance/1000;
    return distance;
}