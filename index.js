var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 


var lastIndex = 0;
var applicants = {};
var keys = [];


// app.use('/public', express.static(path.resolve('./public')));
app.use(express.static('public'));


app.get('/', function(req,res){
    res.status(200).json({message:'Connected to CalPlug waiting room API'});
});

app.post('/client', function(req, res){
    if (!req.body.name || !req.body.position){
        return res.status(400).json({success:0, error:"Name or position not input"});
    }

    applicants[++lastIndex] = {
        'id': lastIndex,
        'name': req.body.name,
        'position': req.body.position
    };
    keys.push(lastIndex);
    res.status(200).json({success:1, message:"Applicant added.", id:lastIndex});
});

app.get('/client/:id', function(req, res){
    if (applicants.hasOwnProperty(req.params.id))
        res.status(200).json({success:1, client: applicants[req.params.id]});
    else
        res.status(400).json({success:0, error:"Does not exist."});
});

app.get('/client', function(req, res){
    var rawLimit = (typeof req.query['limit'] !== 'undefined' && !isNaN(req.query['limit'])) ? req.query['limit'] : Object.keys(applicants).length;
    var negative = (rawLimit < 0);
    var limit = Math.abs(rawLimit);
    
    var toIter = (negative) ? keys.slice().reverse() : keys;
    var response = [];

    for (var key in toIter){
        if (applicants.hasOwnProperty(toIter[key])){
            response.push(applicants[toIter[key]]);
        }

        if (response.length == limit) break;
    }

    res.status(200).json({success: 1, clients: response});
});

app.delete('/client/:id', function(req, res){
    delete applicants[req.params.id];
    res.status(200).json({suc:1, message:'Success'});
});

//Start Server
var server = app.listen(process.env.PORT || 8080, function () {
    var host = server.address().address
    var port = server.address().port
  
    console.log("API listening at http://%s:%s", host, port)
});