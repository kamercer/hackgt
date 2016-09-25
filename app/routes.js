var geolib = require("geolib");
var fs = require('fs');
var get = require('get');

var MongoClient = require('mongodb').MongoClient;


module.exports = function(app){
    
    //index page
    app.get('/', function(req, res){
        res.sendFile('/views/index.html', {root: __dirname + '/../public'});
    });

    app.get('/results', function(req, res){
        if(req.query.lat){
            var lat = req.query.lat;
            var log = req.query.log;
            var hours = req.query.hours;

            Glat = lat;
            Glog = log;

            doStuff(req, res, hours, false);
        }else{
            //manually set location of hartsfield-jackson airport
            Glat = 33.640728;
            Glog = -84.427700;

            var arrivingFlightNumber = req.query.arrivingFlightNumber;
            var arrivingFlightTime = new Date(req.query.arrivingFlightTime);
            var departingFlightNumber = req.query.departingFlightNumber;
            var departingFlightTime = new Date(req.query.departingFlightTime);

            get('https://demo30-test.apigee.net/v1/hack/status?flightNumber=' + arrivingFlightNumber + '&flightOriginDate=' + arrivingFlightTime.toISOString().substr(0, 10) + '&apikey=bV3G0zA7ZjYGIlRtezCJC7oAALQfLnhK')
            .asString(function(err1, data1){

                data1 = JSON.parse(data1);

                get('https://demo30-test.apigee.net/v1/hack/status?flightNumber=' + departingFlightNumber + '&flightOriginDate=' + departingFlightTime.toISOString().substr(0, 10) + '&apikey=bV3G0zA7ZjYGIlRtezCJC7oAALQfLnhK')
                .asString(function(err2, data2){

                    data2 = JSON.parse(data2);

                    //This will be in milliseconds
                    
                    var begin = new Date(data1.flightStatusResponse.statusResponse.flightStatusTO.flightStatusLegTOList.arrivalLocalTimeEstimatedActual);
                    begin = begin.getTime();

                    var end = new Date(data2.flightStatusResponse.statusResponse.flightStatusTO.flightStatusLegTOList.departureLocalTimeScheduled);
                    end = end.getTime();


                    var hours = end-begin;
                    hours = hours / 1000; //now seconds
                    hours = hours / 60; //now minutes
                    hours = hours / 60; //now hours

                    doStuff(req, res, hours, true);
                });
            });
        }
    });
};

function doStuff(req, res, hours, isDelta){
            MongoClient.connect('mongodb://localhost/erasmus', function(err, db) {
            console.log(err);

            var limit;
            var mode;

            console.log(hours);

            if(isDelta){
                limit = hours * 9000;
                mode="driving";
            }else{
                limit = hours * 4500;
                mode="walking";
            }
            
            var potentialMarkers = [];
            
            var cursor = db.collection('historicalMarkers').find({"CONDITION" : 1});
            

            cursor.toArray().then(function(docs){
                db.close(); 
                
                docs.forEach(function(doc, index){
                    var distance = geolib.getDistance({latitude : Glat, longitude : Glog}, {latitude : doc.LATITUDE, longitude : doc.LONGITUDE});

                    
                    if((distance) <= (limit)){
                        potentialMarkers.push(doc);
                    }
                }); 

                //I now have a set of potential markers

                var randomArray = [];

                var upperLimit;
                if(potentialMarkers.length < 40 ){
                    upperLimit = potentialMarkers.length;
                }else{
                    upperLimit = 40;
                }

                console.log(upperLimit);
                for(var i = 0; i < upperLimit; i++){
                    var num = Math.floor(Math.random() * potentialMarkers.length);
                    randomArray.push(potentialMarkers[num]);
                    potentialMarkers.splice(num, 1);
                }
                    
                var start = (new Date).getTime();
                console.log('start');
                var current = getGood(randomArray, [], [], limit);
                var end = (new Date).getTime();

                console.log("seconds: " + (end-start)/1000);

                console.log('/////////////////////////////////////////////////');
                
                var srcString;
                if(current.length > 1){
                    srcString = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyApi4m2QEuUCKIiMtuUrmqicZwRrhza6gg&origin=" + Glat + "," + Glog + "&destination=" + current[current.length-1].LATITUDE + "," + current[current.length-1].LONGITUDE + "&mode=" + mode + "&waypoints=";
                }else{
                    srcString = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyApi4m2QEuUCKIiMtuUrmqicZwRrhza6gg&origin=" + Glat + "," + Glog + "&destination=" + Glat + "," + Glog;
                }
                
                
                console.log(current);
                for(var i = 0; i < current.length-1; i++){
                    //console.log(current[i].LATITUDE + ", " + current[i].LONGITUDE);
                    srcString = srcString + current[i].LATITUDE + "," + current[i].LONGITUDE;

                    if(i < current.length-2){
                        srcString += "|";
                    }
                }

                console.log(srcString);

                fs.readFile('./public/directions.html', 'utf8', function(err, data){
                    data = data.replace("%%%", srcString);
                    res.send(data);
                });
            });
        });
}

var Glat;
var Glog;
function getGood(potentialMarkers, current, working, limit){
    
    //check if I need to return home
    var distanceToHome;
    if(working.length > 0){
        var currentLocation = working[working.length-1];
        distanceToHome = geolib.getDistance({latitude : Glat, longitude : Glog}, {latitude : currentLocation.LATITUDE, longitude : currentLocation.LONGITUDE});
    }else{
        distanceToHome = 0;
    }
        
    for(var i = 0; i < potentialMarkers.length; i++){
        
        working.push(potentialMarkers[i]);
        var temp = null;

        //true - if the current route + new location is greater than specified time or there are no more potentialMarkers
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

        working.pop();

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