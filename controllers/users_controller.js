const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err,user){
        return res.render('user_profile',{
            title:"USER-PROFILE",
            profile_user: user
    });
    
    })
}

module.exports.update = async function(req,res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err,user){
    //         req.flash('success','Updated!');
    //         return res.redirect('back');
    //     });
    // }else{
    //     req.flash('error','Unauthorized');
    //     return res.status(401).send('Unauthorised');
    // }

    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res, function(err){
                if(err){console.log('****Multer ERROR ',err)}

                user.name =req.body.name;
                user.email = req.body.email;

                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..',user.avatar));
                    }

                    //this is saving the path of the uploaded file in the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorised');
    }
    
}


// module.exports.update = function(req,res){
//     res.end('<h1>Updated!</h1>')
// }


// RENDER SIGN UP PAGE
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:'Codeial || sign Up'
    })
}

//RENDER SIGN IN PAGE
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:"Codeial || Sign In"
    })
}

//GET THE SIGN UP DATA
module.exports.create = function(req,res){
      if (req.body.password != req.body.confirm_password){
        req.flash('error','Passwords do not match');
        return res.redirect('back');
      }

      User.findOne({email:req.body.email},function(err,user){
        if (err){req.flash('error',err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if (err){req.flash('error',err); return }

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success','You have signed Up successfully, Login to continue!');
            return res.redirect('back');
        }

      })


}

//Sign in
module.exports.createSession = function(req,res){
    req.flash('success','Logged in successfilly');
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','You have Logged Out!');
        return res.redirect('/');
    });
    // return res.redirect('/');
}
