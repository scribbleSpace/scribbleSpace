const User = require('../models/User');

const userCtrl = {};

userCtrl.createUser = function(req, res, next) {
  const { name, email, password } = req.body;
  User.create({ name, email, password }, (err, db) => {
    if (err) {
      return res.render('../views/register', { error: err });
    }
    res.locals.acc = db; // res.locals.id = db._id;
    console.log('account created');
    return next();
  });
};

userCtrl.verifyUser = function(req, res, next) {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }
  if (errors.length > 0) {
    res.render('register', { errors, name, email, password, password2 });
  } else {
    User.findOne({ email: email }, function(err, user) {
      if (user) {
        // user exist
        console.log('email exist!!!!!');
        errors.push({ msg: 'Email is already registered' });
        res.render('register', { errors, name, email, password, password2 });
      } else {
        console.log('user verified');
        return next();
      }
    });
  }
};

module.exports = userCtrl;
