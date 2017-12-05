exports.index = function(req,res){
    if(req.session.codigoCliente || req.cookies.findit_client_cookie)
        res.render("index", {option : req.params.option });
    else   
        res.redirect("/login");
}

exports.login = function(req,res){
    if(req.session.codigoCliente || req.cookies.findit_client_cookie)
        res.redirect("/");
    else  
        res.render("auth", { value : "login"});
}

exports.signup = function(req,res){
    if(req.session.codigoCliente)
        res.redirect("/");
    else  
        res.render("auth", { value : "signup"});    
}

exports.forgot = function(req,res){
    if(req.session.codigoCliente)
        res.redirect("/");
    else  
        res.render("auth", { value : "forgot"});
}

exports.chat = function(req,res){
    res.render("chat");
}

exports.notFound = function(req,res){
    res.status(404).render("404", { url: req.originalUrl });
}