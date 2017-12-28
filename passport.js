module.exports = function(passport, user) {

    var crypto            = require('crypto'),
        config            = require("./config"),    
        FacebookStrategy  = require('passport-facebook').Strategy,
        LocalStrategy     = require('passport-local').Strategy,
        User              = user;

    passport.serializeUser(function(user, done) {      
        done(null, user.codigoCliente);
    });

    passport.deserializeUser(function(id, done) { 
        user.findById(id).then(function(user) {     
            if (user) {     
                done(null, user);     
            } else     
                done(user.errors, null);            
        });     
    });

    passport.use(new FacebookStrategy({
        clientID            : config.facebook_api_key,
        clientSecret        : config.facebook_api_secret,
        callbackURL         : config.callback_url,
        passReqToCallback   : true,
        profileFields       : ['id', 'displayName', 'emails']
    },  function(req, accessToken, refreshToken, profile, done) {
            process.nextTick(function() {        
                let linkFotoCliente = "https://graph.facebook.com/" +
                                profile.id +
                                "/picture?height=400&width=400",
                    nomeCliente = profile.displayName,
                    emailCliente = profile.emails[0].value;                    
                
                User.findOne({
                    where: {
                        emailCliente: emailCliente
                    }
                }).then(function(user) {
                    if (!user) { 
                        return done({
                            value: createUserByFacebook,
                            createUserByFacebook: true,
                            name: nomeCliente,
                            email: emailCliente,
                            picture: linkFotoCliente
                        }, false);
            
                    } else          
                        return done(null, user);   
                                
                }).catch(function(err) {     
                    console.log("Error:", err);     
                    return done({
                        error : true,
                        message: "Ocorreu algum erro. Tente novamente"
                    }, false);     
                });
            });
        }
    ));

    passport.use('login', new LocalStrategy({     
        usernameField: 'emailCliente',     
        passwordField: 'senhaCliente',
        passReqToCallback: true     
    }, function(req, emailCliente, senhaCliente, done) {             
            var User = user;     
            var isValidPassword = function(userpass, password) {
                let cryptPass = crypto.createHash('sha1')
                            .update(password).digest("hex");
                return cryptPass == userpass;     
            }
     
            User.findOne({
                where: {
                    emailCliente: emailCliente
                }
            }).then(function(user) {
                if (!user) { 
                    return done({
                        error: true,
                        message: "Não existe nenhum usuário com este e-mail!"
                    }, false);     
                }
     
                if (!isValidPassword(user.senhaCliente, senhaCliente)) {
                    return done({
                        error : true,
                        message: "Senha incorreta"
                    }, false);     
                }

                return done(null, user);     
     
            }).catch(function(err) {     
                console.log("Error:", err);     
                return done({
                    error : true,
                    message: "Ocorreu algum erro. Tente novamente"
                }, false);     
            });    
        }     
    ));

    passport.use('signup', new LocalStrategy({
		usernameField		: 	'emailCliente',
		passwordField		: 	'senhaCliente',
		passReqToCallback	:	true

	}, function(req, emailCliente, senhaCliente, done){        
            var generateHash = function(password) {
                return cryptPass = crypto.createHash('sha1')
                        .update(password).digest("hex");
            };

            User.findOne({
                where: {
                    emailCliente: emailCliente
                }
            }).then(function(user) {
                if (user){
                    return done({
                        error: true,
                        message: "Já existe um usuário com este e-mail!"
                    }, false);
                } else {
                    var userPassword = generateHash(senhaCliente);
                    var data = {
                        emailCliente: emailCliente,
                        senhaCliente: userPassword,
                        nomeCliente: req.body.nomeCliente
                    };
                    User.create(data).then(function(newUser, created) {
                        if (!newUser) 
                            return done(null, false);   
                        else
                            return done(null, newUser);                        
                    });
                }
            });
        }
    ));
}