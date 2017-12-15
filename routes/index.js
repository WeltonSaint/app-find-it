exports.index = function(req, res){
    validateIsLogged(req, res, "/login", "index", {option : req.params.option });
}

exports.login = function(req, res){
    validateIsNotLogged(req, res, "/", "auth", {value: "login"});
}

exports.signup = function(req, res){
    validateIsNotLogged(req, res, "/", "auth", {value: "signup"}); 
}

exports.forgot = function(req, res){
    validateIsNotLogged(req, res, "/", "auth", {value: "forgot"});
}

exports.recover = function (req, res) {
    validateIsNotLogged(req, res, "/", "auth", {value: "recover", token: req.params.token});
}

exports.chat = function(req, res){
    validateIsLogged(req, res, "/login", "chat", {});
}

exports.notFound = function(req, res){
    res.status(404).render("404", { url: req.originalUrl });
}

validateIsLogged = function(req, res, redirect, render, renderValues) {
    if((req.session) && req.session.codigoCliente || req.cookies.findit_client_cookie)      
        res.render(render, renderValues); 
    else
        res.redirect(redirect);
}

validateIsNotLogged = function(req, res, redirect, render, renderValues) {
    if(req.session.codigoCliente || req.cookies.findit_client_cookie)
        res.redirect(redirect);
    else
        res.render(render, renderValues);
}