var express = require('express');
var flash = require('connect-flash');
var router = express.Router();
var nodemailer = require('nodemailer');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.post('/send',function(req,res,next){
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'smmominulhaque009@gmail.com',
			pass: '2013-2-60-009'
		}
	});
	var mailOptions = {
		from: req.body.name+' <johndoe@outlook.com>',
		to: 'sejan840@gmail.com',
		subject: 'Contact Form',
		text: 'You have a new mail.. Name: '+req.body.name+' Email: '+req.body.email+' Message: '+req.body.message,
		html: '<p>You got a new contact message</p> Name: '+req.body.name+'<br/>Email: '+req.body.email+'<br/>Message: '+req.body.message
	};
	transporter.sendMail(mailOptions,function(error,info) {
		if(error)
		{
            req.flash('error','Message not sent');
			console.log(error);
			res.redirect('/contact');
		}
		else{
            req.flash('success','Your Email Sent');
			console.log('Message Send: '+info.response);
			res.redirect('/contact');
		}
	});
});

module.exports = router;
