var geohash = require("geohash").GeoHash;

exports.index = function(req, res, values){
    res.render("index", values); 
}

exports.insertItem = function(req, res){
    validateIsLogged(req, res, "/login", "insertItem", 
                        { lat:-64, lon:-31});
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

exports.profile = function(req, res, values){
    validateIsLogged(req, res, "/login", "profile", values);
}

exports.chat = function(req, res){
    validateIsLogged(req, res, "/login", "chat", {});
}

exports.notFound = function(req, res){
    res.status(404).render("404", { url: req.originalUrl });
}

validateIsLogged = function(req, res, redirect, render, renderValues) {
    if(req.cookies.findit_client_cookie || req.isAuthenticated())      
        res.render(render, renderValues); 
    else
        res.redirect(redirect);
}

validateIsNotLogged = function(req, res, redirect, render, renderValues) {
    if(req.cookies.findit_client_cookie || req.isAuthenticated())
        res.redirect(redirect);
    else
        res.render(render, renderValues);
}