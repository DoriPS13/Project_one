var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);
var passport = require("passport");
var passportLocal = require("passport-local");

module.exports = function (sequelize, DataTypes){
  var User = sequelize.define('user', {
    username: { 
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true, 
      validate: {
        len: [6, 30],
      }
    },
    password: {
      type:DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    }
  }, {
    classMethods: {
      associate: function(db){
        User.hasMany(db.item, {through: db.user_items});
      },
      encryptPass: function(password) {
        var hash = bcrypt.hashSync(password, salt);
        return hash;
      }, 
      comparePass: function(userpass, dbpass) {
      // don't salt twice when you compare....watch out for this
      return bcrypt.compareSync(userpass, dbpass);  
    },
    createNewUser: function(username, password, success, err) {
      console.log("CREATING NEW USER")
      if(password.length < 6) {
        err({message: "Password should be more than six characters"});
      }
      else{
        User.create({
          username: username,
          password: User.encryptPass(password)
        }).error(function(error) {
          console.log("HANDLING ERROR ON CREATE")
          if(error.username){
            err({message: 'Your username should be at least 6 characters long', username: username});
          }
          else{
            err({message: 'An account with that username already exists', username: username});
          }
        }).success(function(user) {
          console.log("HANDLING SUCCESS ON CREATE")
          success({message: 'Account created, please log in now'},user);
        });
      }
    }
    } // close classMethods
  } //close classMethods outer 
); // close define user

passport.use(new passportLocal.Strategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, 
function(req, username, password, done) {
      // find a user in the DB
      User.find({
        where: {
          username: username
        }
      })
      
      // done(err) // when we screw up (db issues)
      // done(null, false) // when we do right, but user does wrong
      // done(null, user) // when we do right and user does right! Woohoo!
      
      //when that's done....
      .done(function(error, user){
        if(error){
          console.log(error)
          return done(err, req.flash('loginMessage', 'Oops! Something went wrong...'))
        }
        if (user === null) {
          return done(null, false, req.flash('loginMessage', 'Username does not exist'))
        }
        if((User.comparePass(password, user.password)) !== true) {
          return done(null, false, req.flash('loginMessage', 'Invalid password'))
        }
        done(null,user);
      });
    }));

return User;
};
