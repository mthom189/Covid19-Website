const Test = require('../models/tests');

//check if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    }else {
         req.flash('error', 'You are logged in already');
         return res.redirect('/users/profile');
     }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) =>{
    if(req.session.user){
        return next();
    }else {
         req.flash('error', 'You need to log in first');
         return res.redirect('/users/signin');
     }
};

//check if user is author of the story
exports.isAuthor = (req, res, next) =>{
    let id = req.params.id;
    Test.findById(id)
    .then(test=>{
        if(test) {
            if(test.patientID == req.session.user) {
                return next();
            } else {
                req.flash('error', 'You do not have editing priveleges for this test');
                return res.redirect('/users/profile');
                // let err = new Error('Unauthorized to access the resource');
                // err.status = 401;
                // return next(err);
            }
        } else {
            let err = new Error('Cannot find a test with id ' + req.params.id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};