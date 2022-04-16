const {validationResult} = require('express-validator');
const User = require('../../models/user')
const passport = require('passport');
require('../../config/passport_local')(passport);
const bcrypt = require('bcrypt');
const e = require('connect-flash');


const login = async (req, res, next) => {
    
    res.status(200).json({'Login' : 'Login Page'})

}

const loginPost = (req, res, next) => {
    
    //Logine post isteği geldiğinde
    passport.authenticate('local', {
        successRedirect: '/', //Başarılı giriş olursa buraya yönlendir
        failureRedirect: '/login',
        failureFlash: true,
        successMessage: true,
    })(req, res, next);
    //res.json('Giriş Başarılı')
}

const register = async (req, res, next) => {
    res.status(200).json({'Register' : 'Register Page'})
}

const registerPost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json(errors.array())
        console.log("2");
    } else {
        try {
            console.log("1");
            const newUser = new User ({
                email : req.body.email,
                username : req.body.username,
                name : req.body.name,
                role : req.body.role,
                isActive : false,
                isDeleted : false,

                //Yeni kullanıcı kaydederken şifresini hashliyoruz
                password : await bcrypt.hash(req.body.password, 10),
            });

            //Veri tabanı kaydı için
            await newUser.save();
            res.status(200).json(newUser)
            console.log("Kullanıcı kaydedildi");

        } catch (err) {
            console.log("Kayıt hatalı çalıştı" + err);
        }
    }
}

const logout = (req, res, next) => {

    req.logout(); //Sessiondaki id bilgisini siler

    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        //console.log(req.session);
        res.json('Çıkış yapıldı');
    })

}


module.exports= {
    login,
    loginPost,
    register,
    registerPost,
    logout,
    
}