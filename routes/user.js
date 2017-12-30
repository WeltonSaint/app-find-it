var crypto        = require('crypto'),
    Sequelize = require("sequelize"),
    config    = require("../config"),
    sequelize = new Sequelize(config.database, 
                config.username, config.password, config),
    nodeMailer    = require("nodemailer"),    
    passport      = require('passport'),
    models        = require("../models");
    EmailTemplate = require("email-templates").EmailTemplate;
    User          = models.user;

require('../passport.js')(passport, User);

var transporter = nodeMailer.createTransport(config.email_sender + ':' +
                config.password_email + '@smtp.gmail.com');

var sendResetPasswordLink = transporter.templateSender(
    new EmailTemplate('views/templates/resetPassword'), {
        from: "support@app-find-it.herokuapp.com",
});

/**
 * Request to get all users.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllUsers = function(req, res){
    User.findAll({include: [{model: models.user}]}).then(function(users) {
        if (!users) {             
            res.json({
                "error" : true,
                "message": "Não foi possível encontrar usuários" 
            });            
        } else          
            res.json(users);                   
    }).catch(function(err) {     
        console.log("Error:", err);     
        res.json({
            error : true,
            message: "Ocorreu algum erro. Tente novamente"
        });     
    });        
};

/**
 * Request to get info of user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getUser = function(req, res, fun){
    User.findOne({
        where: {
            codigoCliente: req.params.codigoCliente
        }
    }).then(function(user) {
        if (!user) {             
            return {
                "error" : true,
                "message": "Não foi possível encontrar este usuário" 
            };            
        } else if(fun)
            fun(req, res, user);                            
        else
            return user;
    }).catch(function(err) {   
        return {
            error : true,
            message: "Ocorreu algum erro. Tente novamente"
        };     
    });  
};

/**
 * Request of forgot password;
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.forgot = function(req, res){
    User.findOne({
        where: {
            emailCliente: req.body.emailCliente
        }
    }).then(function(user) {
        if (!user) {             
            res.json({
                "error" : true,
                "message" : "Não existe nenhum usuário com este e-mail!" 
            });            
        } else {
            email = req.body.emailCliente;
            let tokenUrl = generateHash(email.toLowerCase());
            sendPasswordReset(req, res, email.toLowerCase(),
                        user.nomeCliente, tokenUrl);
        }                   
    }).catch(function(err) {     
        console.log("Error:", err);     
        res.json({
            error : true,
            message: "Ocorreu algum erro. Tente novamente"
        });     
    });  
}

/**
 * Function to send email to reset password.
 */
sendPasswordReset = function (req, res, email, username, tokenUrl) {    
    sendResetPasswordLink({
        to: email,
        subject: 'Resetar Senha - Find-It'
    }, {
        username: username,
        token: tokenUrl,
        year: new Date().getFullYear()
    }, function (err, info) {
        if (err) {
            res.json({"error" : true, 
                "message" : err});
            console.log(err);
        } else {
            res.json({"error" : false, 
                "message" :
                "Será enviado um e-mail para você cadastrar" +
                " uma nova senha"});            
        }
    });
};

/**
 * Function to update the last activity of user.
 * @param {*} codigoCliente 
 */
exports.updateLastActivity = function(codigoCliente){   
    User.update({
        ultimaAtividade: sequelize.literal('CURRENT_TIMESTAMP')
    },{ 
        where: {
            codigoCliente: codigoCliente
    }}).then(function(user) {                           
    }).catch(function(err) {     
        console.log("Error:", err);
    });
} 

/**
 * R
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.recoverPassword = function(req, res){
    
    let password = generateHash(req.body.senhaCliente);
    
    User.update({
        senhaCliente: password
    },{
        where: sequelize.where(sequelize.fn('sha1',
        sequelize.col('emailCliente')), req.body.token)
    }).then(function(user) {
        if (!user[0]) {             
            res.json({
                "error" : true, 
                "message" : "Não foi possível alterar sua senha. Tente novamente!"
            });          
        } else {
            res.json({
                "error" : false,
                "message" : "Senha alterada com sucesso!"});
        }                   
    }).catch(function(err) {     
        console.log("Error:", err);     
        res.json({
            error : true,
            message: "Ocorreu algum erro. Tente novamente"
        });     
    });
} 

/**
 * Request to get user logged.
 * @param {*} req 
 * @param {*} res 
 */
exports.getLoggedUser = function(req, res, fun){      
    if(req.cookies.findit_client_cookie){
        req.params.codigoCliente = req.cookies.findit_client_cookie;
        exports.updateLastActivity(req.params.codigoCliente);
        exports.getUser(req, res, fun);           
    } else if(req.isAuthenticated()){
        exports.updateLastActivity(req.user.codigoCliente);
        fun(req, res, req.user); 
    }    
}
/**
 * Default request Login.
 * 
 * @param {*]} req 
 * @param {*} res 
 */
exports.login = function(req, res){    
    passport.authenticate('login', function(err, user) {
        if (err)
            return res.json(err) 
        else if (!user) 
            return res.redirect('/login');
        else{ 
            if(req.body.continuarLogado)
                    res.cookie('findit_client_cookie',
                        user.codigoCliente); 
            
            req.logIn(user, function(err) {
                if (err)  
                    console.log(err);                
                
                return res.json({
                    "error" : false,
                    "client" : user
                });
            });
        }
    })(req, res);
};

/**
 * Request login using smartphone.
 * 
 * @param {*]} req 
 * @param {*} res 
 */
exports.loginSmartphone = function(req, res){    
    passport.authenticate('login-smartphone', function(err, user) {
        if (err)
            return res.json(err) 
        else if (user){            
            req.logIn(user, function(err) {
                if (err)  
                    console.log(err);                
                
                return res.json({
                    "error" : false,
                    "client" : user
                });
            });
        }
    })(req, res);
};

/**
 * Request login by Facebook using smartphone.
 * 
 * @param {*]} req 
 * @param {*} res 
 */
exports.loginFacebookSmartphone = function(req, res){    
    User.findOne({
        where: {
            emailCliente: req.body.emailCliente
        }
    }).then(function(user) {
        if (!user) { 
            res.json({
                "option" : "createProfileFromFacebook",
                "nomeCliente" : req.body.nomeCliente,
                "emailCliente": req.body.emailCliente,
                "linkFotoCliente": req.body.linkFotoCliente
            });     
        } else {
            User.update({
                nomeCliente : req.body.nomeCliente,
                emailCliente: req.body.emailCliente,
                linkFotoCliente: req.body.linkFotoCliente
            },{ 
                where: {
                    emailCliente: req.body.emailCliente,
            }}).then(function(user) {
                User.findOne({
                    where: {
                        emailCliente: req.body.emailCliente
                    }
                }).then(function(user) {
                    if (!user) {      
                        res.json({
                            error : true,
                            message: "Não foi possível fazer o login. Tente novamente"
                        });    
                    } else {
                        res.json({
                            error : false,
                            client: user
                        });
                    }
                }).catch(function(err) {     
                    console.log("Error:", err);     
                    res.json({
                        error : true,
                        message: "Ocorreu algum erro. Tente novamente"
                    });     
                });                            
            }).catch(function(err) {     
                console.log("Error:", err);     
                res.json({
                    error : true,
                    message: "Ocorreu algum erro. Tente novamente"
                }); 
            });
        }   

    }).catch(function(err) {     
        console.log("Error:", err);     
        res.json({
            error : true,
            message: "Ocorreu algum erro. Tente novamente"
        });     
    }); 
};

/**
 * Request sign up using smartphone.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.signupSmartphone = function(req, res){
    passport.authenticate('signup-smartphone', function(err, user) {
        if (err)
            return res.json(err) 
        else if (user) 
        res.json({
                "error" : false,
                "message" : "Usuário cadastrado com sucesso!"
            }); 
    })(req, res);
};

/**
 * Default request sign up.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.signup = function(req, res){
    passport.authenticate('signup', function(err, user) {
        if (err)
            return res.json(err) 
        else if (!user) 
            return res.redirect('/signup');
        else 
        res.json({
                "error" : false,
                "message" : "Usuário cadastrado com sucesso!"
            }); 
    })(req, res);
};

/**
 * Request to logout.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.logout = function(req, res){    
    req.logout();
    res.clearCookie("findit_client_cookie");
    res.redirect("/login");
}

handleLoginFacebook = function(req, rows){ 
    /*if (rows.length == 0)
        ;//redirect to create user by Facebook
    else{        
        var query   = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        var params  = ["Cliente", "nomeCliente", req.body.nomeCliente,
                    "linkFotoCliente", req.body.linkFotoCliente,
                    "emailCliente", req.body.emailCliente];
        res = db.executeWithoutRes(req, query, params, 
                getUserbyFacebook);
    } */   
}

/**
 * Function to generate password hash.
 */
generateHash = function(password) {
    return cryptPass = crypto.createHash('sha1')
            .update(password).digest("hex");
};

