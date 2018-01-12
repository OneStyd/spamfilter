var express = require('express'),
    pyshell = require('python-shell'); 
    sequelize = require('../dbconnection');

var mail = sequelize.import('./../models/mail.model');

class Mail{
    constructor(){}

    getInbox(username, res){
        return mail.findAll({
           where: {typemail: 1, recipients: username}
            }).then(function(data){
                res.status(200).json({status: true, message: "success", data: data});
            }).catch(function(err){
                res.status(500).json({status: false, message: "an error occured", err: err})
            })
    }

    getSpam(username, res){
        return mail.findAll({
           where: {typemail: 0, recipients: username}
            }).then(function(data){
                res.status(200).json({status: true, message: "success", data: data});
            }).catch(function(err){
                res.status(500).json({status: false, message: "an error occured", err: err})
            })
    }

    getSentMail(username, res){
        return mail.findAll({
           where: {frommail: username}
            }).then(function(data){
                res.status(200).json({status: true, message: "success", data: data});
            }).catch(function(err){
                res.status(500).json({status: false, message: "an error occured", err: err})
            })
    }

    getMailDetail(id, res){
        return mail.findById(id).then(function(data){
                res.status(200).json({status: true, message: "success", data: data});
            }).catch(function(err){
                res.status(500).json({status: false, message: "an error occured", err: err})
            })
    }

    sendMail(body, res){
        let py_options = {
                scriptPath: "E:/sem7/TKI/projek/spamfilter/spamfilter/backend/predictor",
                mode: 'text',
                args: [body.content , body.subject]    
            };

            pyshell.run('classification.py', py_options, function(err, result){
                if(err){
                    console.log(err)
                    res.json({status: false, message: err});
                }else{
                    let predicted = result[0];
                    console.log(predicted)
                    predicted = JSON.parse(predicted)
                    res.status(200).json({status: true, message: 'Prediction success!', results: predicted});
                    mail.create({typemail: predicted['hasil'], recipients: body.recipients, subject: body.subject, content: body.content, frommail: body.frommail})
                }
            });
        
    }

    
}

module.exports = new Mail;