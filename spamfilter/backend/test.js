var express = require('express'),
    sequelize = require('./dbconnection');

var suggestion = sequelize.import('./models/suggestion.model');

var date = new Date();

suggestion.findAll({
    where: {$or: [
        {status: "SUBMITTED"},
        {updatedAt: {$lt: date}}
    ]}
}).then(function(res){
    console.log(res);
})