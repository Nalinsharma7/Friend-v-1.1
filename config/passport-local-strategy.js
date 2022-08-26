const passport = require('passport');
const User = require('../models/user');

const LocalStategy = require('passport-local').Strategy;

// const User = require('../models/user');

//authentication using passport
passport.use(new LocalStategy({
    usernameField:'email',
    passReqToCallback: true
    },
    function(req,email,password, done){
        //find a user and establish identity
        User.findOne({email: email},function(err,user){
            if (err){
                
                req.flash('error',err);
                return done(err);
            }

            if (!user || user.password != password){
                
                req.flash('error','Invalid Username or password');
                return done(null, false);
            }

            return done(null, user);
        });
    }


));


// serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user,done){
    done(null, user.id);
});


// deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if (err){
            console.log('Error in finding user --> passport');
            return done(err);
        }

        return done(null, user);
    });
});

//Check if the user is authenticated
passport.checkAuthentication = function(req,res,next){
    //if the user is signed in, then pass on the request to next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.users contains the current signed in user from the session cookie and we are sending this to the locals for the views
        res.locals.user = req.user;

    }
    next();
}

module.exports = passport;