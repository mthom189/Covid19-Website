const model = require('../models/tests');
const user = require('../models/users');

exports.index = (req, res)=>{
    model.find()
    .then(tests=>res.render('./connection/connections', {tests}))
    .catch(err=>next(err));
};

exports.contact = (req, res)=>{
    res.render('./general/contact')
};

exports.about = (req, res)=>{
    res.render('./general/about')
};

exports.new = (req, res)=>{
    res.render('./connection/newConnection');
};

exports.create = (req, res, next)=>{
    let test = new model(req.body);
    test.patientID = req.session.user;
    test.createDate = new Date();
    test.save()
    .then(test => {
        req.flash('success', 'Test has been created successfully');
        res.redirect('/connection/'+ test.id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
        
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    // model.findById(id).populate('author', 'firstName lastName')
    Promise.all([model.findById(id).populate('author', 'firstName lastName'), user.findById(req.session.user)])
    .then(results=>{
        const [test, user] = results;
        if(test){   
            res.render('./connection/connection', {test, user});
            } else{
                let err = new Error('Cannot find a test with id ' + id);
                err.status = 404;
                next(err);
            }
    })
    .catch(err=>next(err));

};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(test=>{
            res.render('./connection/editConnection', {test});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let test = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, test, {useFindAndModify: false, runValidators: true})
    .then(test=>{
        return res.redirect('/connection/'+id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;
    
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(test =>{
        res.redirect('/connection');
    })
    .catch(err=>next(err));
};
