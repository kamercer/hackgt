var geolib = require("geolib");
var mongoose = require("mongoose");
var fs = require('fs');

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

        Glat = lat;
        Glog = log;

        console.log(lat);
        console.log(log);
        console.log(hours);

        MongoClient.connect('mongodb://localhost/erasmus', function(err, db) {
            console.log(err);
            
            var potentialMarkers = [];
            
            var cursor = db.collection('historicalMarkers').find({"CONDITION" : 1});
            

            cursor.toArray().then(function(docs){
                console.log(docs.length);
                db.close(); 
                
                docs.forEach(function(doc, index){
                    var distance = geolib.getDistance({latitude : lat, longitude : log}, {latitude : doc.LATITUDE, longitude : doc.LONGITUDE});

                    if((distance) <= (hours * 5000)){
                        potentialMarkers.push(doc);
                    }
                }); 

                //I now have a set of potential markers
                console.log(potentialMarkers.length);
                //console.log(potentialMarkers.splice(0, 4));

                //get random values
                var randomArray = [];

                for(var i = 0; i < 50; i++){
                    var num = Math.floor(Math.random() * potentialMarkers.length);
                    randomArray.push(potentialMarkers[num]);
                    potentialMarkers.splice(num, 1);
                }
                    
                var start = (new Date).getTime();
                var current = getGood(randomArray, [], [], (hours * 5000));
                var end = (new Date).getTime();

                console.log("seconds: " + (end-start)/1000);

                console.log('/////////////////////////////////////////////////');
                
                var srcString = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyApi4m2QEuUCKIiMtuUrmqicZwRrhza6gg&origin=" + Glat + "," + Glog + "&destination=" + current[current.length-1].LATITUDE + "," + current[current.length-1].LONGITUDE + "&mode=walking&waypoints=";
                
                for(var i = 0; i < current.length-1; i++){
                    //console.log(current[i].LATITUDE + ", " + current[i].LONGITUDE);
                    srcString = srcString + current[i].LATITUDE + "," + current[i].LONGITUDE;

                    if(i < current.length-2){
                        srcString += "|";
                    }
                }

                console.log(srcString);

                fs.readFile('/home/kyle/hackgt/public/directions.html', 'utf8', function(err, data){
                    console.log(err);
                    data = data.replace("%%%", srcString);
                    res.send(data);
                });

                console.log(addUp(current)/1000);
                //res.end();
            });
        });
    });
};

var Glat;
var Glog;
function getGood(potentialMarkers, current, working, limit){
    
    //check if I need to return home
    var distanceToHome;
    if(working.length > 0){
        var currentLocation = working[working.length-1];
        distanceToHome = geolib.getDistance({latitude : Glat, longitude : Glog}, {latitude : currentLocation.LATITUDE, longitude : currentLocation.LONGITUDE});
        //console.log(Glat);
        //distanceToHome = distanceToHome/1000;
        //console.log(distanceToHome);
    }else{
        distanceToHome = 0;
    }
        
    for(var i = 0; i < potentialMarkers.length; i++){
        
        working.push(potentialMarkers[i]);

        var temp = null;

        //true - if the current route + new location is greater than specified time
        //console.log(addUp(working));
        //console.log(distanceToHome);
        if(addUp(working)+distanceToHome > limit || potentialMarkers.length === 0){
            //console.log('hit : ' + addUp(working) + " | " + (addUp(current)));
            if(working.length > current.length){
                temp = working;
            }else{        
                temp = current;
            }
        }else{
            //console.log('calling new method: ' + potentialMarkers.length + " | " + current.length + " | " + working.length + " | " + i);
            temp = getGood(potentialMarkers.slice(i+1), current.slice(0), working.slice(0), limit);
            //console.log('old method: ' + potentialMarkers.length + " | " + temp.length + " | " + i);
        }
            
            
        
            
        
        //console.log(temp);
        working.pop();
            
        //console.log(geolib.getDistance({latitude : 33.778463, longitude : -84.398881}, {latitude : temp[0].LATITUDE, longitude : temp[0].LONGITUDE}));
           
        if(addUp(temp) <= limit && temp.length > current.length){
            current = temp;
        }
        //console.log('end: ' + current.length + " | " + addUp(current));
        //console.log('this ran : ' + potentialMarkers.length + " | " + i);
            
    }

    return current;
    
}

//returns meters
function addUp(current){
    var distance = 0;

    if(current.length > 0){
        distance = distance + geolib.getDistance({latitude : Glat, longitude : Glog}, {latitude : current[0].LATITUDE, longitude : current[0].LONGITUDE});
    }

    for(var i = 1; i < current.length; i++){
        distance = distance + geolib.getDistance({latitude : current[i-1].LATITUDE, longitude : current[i-1].LONGITUDE}, {latitude : current[i].LATITUDE, longitude : current[i].LONGITUDE});
        
}

    //return distance/1000;
    return distance;
}