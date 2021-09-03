const User = require('../models/user');
module.exports.profile = function(req,res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id,function(err,user){
            if(user){
                return res.render('users',{
                    title: "Users",
                    user: user
                });
            }
            else{
                res.redirect('/users/sign-in');
            }
        });
    }
    else{
        res.redirect('/users/sign-in');
    }
    /*
    return res.render('users',{
        title: "Users"
    });
    */
};
//Render the sign up page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title: "Codial | Sign Up"
    });
};

//Render the sign in page
module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title: "Codial | Sign In"
    })
}

//get the sign up data
module.exports.create = function(req,res){
    if(req.body.password!= req.body.confirm_password){
        res.redirect('back');
    }

    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log('Error in finding user in signing Up');
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('Error in creating user while signing Up');
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }
        else{
            return res.redirect('back');
        }
    });
}


module.exports.createSession = function(req,res){
    //find the user
    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log('Error in finding user in signing In');
            return;
        }
        //handle user found
        if(user){
            //handle password which doesnt match
            if(user.password!=req.body.password){
                return res.redirect('back');
            }
            //handle session creation
            res.cookie('user_id',user.id);
            return res.redirect('/users/profile');
        }
        else{
            //handle user not found
            return res.redirect('back');
        }
    })

}

module.exports.signOut = function(req,res){
    res.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return res.redirect('/users/sign-in');
}