const {body, checkSchema, validationResult} = require('express-validator');

const user = require('../../models/user');



const registerValidate = {


    name: {
        trim: true,
        notEmpty: true,
        custom: {
            options: async (value) => {
                if(value == '')  return Promise.reject('Ad alanı gerekli')
                if(value.length < 3)  return Promise.reject('Ad alanı 3 karakterden küçük olamaz')
                else {

                    return true
                }
              }
        },
    },
    email : {
        trim: true,
        custom: {
            options: async (value) => {
                if(value == '')  return Promise.reject('Mail alanı gerekli')
                await user.findAll({
                    where: { 
                        email: value
                    }
                }).then(user => {
                    if (user.length > 0) {
                        return Promise.reject('Mail zaten kayıtlı')
                    }
                    return true
                })
              }
        },

    },
    
    username: {
        trim: true,
        custom: {
            options: async (value) => {
                if(value == '')  return Promise.reject('Kullanıcı adı alanı gerekli')
                if(value.length < 4)  return Promise.reject('Kullanıcı adı 4 karakterden küçük olamaz')
                await user.findAll({
                    where: { 
                        username: value
                    }
                }).then(user => {
                    if (user.length > 0) {
                        return Promise.reject('Kullanıcı adı zaten kayıtlı')
                    }
                    return true
                })
              }
        },
    },
    password: {
        trim: true,
        custom: {
            options: (value) => {
                if(value == '')  return Promise.reject('Şifre alanı gerekli')
                else if(value.length < 6)  return Promise.reject('Şifre 8 karakterden küçük olamaz')
                return true
            }
        }
    },
    repassword: {
        trim: true,
        custom: {
            options: (value, { req }) => {
                if(value == '')  return Promise.reject('Şifre onaylama alanı gerekli')
                else if(req.body.password != value)  return Promise.reject('Şifreler uyuşmuyor')
                else return true
            }
        }
        
    },
    
    
}
const passwordValidate  = {
    
    password: {
        trim: true,
        custom: {
            options: (value) => {
                if(value == '')  return Promise.reject('Şifre alanı gerekli')
                else if(value.length < 6)  return Promise.reject('Şifre 8 karakterden küçük olamaz')
                return true
            }
        }
    },
    repassword: {
        trim: true,
        custom: {
            options: (value, { req }) => {
                if(value == '')  return Promise.reject('Şifre onaylama alanı gerekli')
                else if(req.body.password != value)  return Promise.reject('Şifreler uyuşmuyor')
                else return true
            }
        }
        
    },
    
}
const loginValidate = {
    custom : {
        options : ({req, res}) => {
            if (res.locals.error) {
                console.log(res.locals.error);
                const err = res.locals.error
                return Promise.reject(res.json("başarısız" + " " + err))
            }
            else return true
        }
    }
}

module.exports = {
    registerValidate,
    passwordValidate,
    loginValidate
}