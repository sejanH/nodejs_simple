var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isLoggedin , function(req, res, next) {
  res.render('index', { title: 'Express' });
});
function isLoggedin(req,res,next) {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/users/login');
}
module.exports = router;
