var express = require('express'),
    mail = require('../controllers/mail.controller'),
    router = express.Router();

//routing auth
router.get('/inbox', function(req, res, next){
    console.log('masuk router')
    mail.getInbox(req.query.recipients, res);
});

router.get('/spam', function(req, res, next){
    console.log('masuk router')
    mail.getSpam(req.query.recipients, res);
});

router.get('/sentmail', function(req, res, next){
    console.log('masuk router')
    mail.getSentMail(req.query.frommail, res);
});

router.get('/maildetail', function(req, res, next){
    console.log('masuk router')
    mail.getMailDetail(req.query.id, res);
});

router.post('/sendmail', function(req, res, next){
    console.log('masuk router')
    mail.sendMail(req.body, res);
});

module.exports = router;
