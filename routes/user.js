db = require("../db");
var crypto = require('crypto');
exports.getAllUsers = function(req, res){
    var query = "SELECT * FROM ??";
    var params = ["Cliente"];
    db.execute(req, res, query, params, null);        
        
};

exports.getUser = function(req, res){
    var query = "SELECT * FROM ?? WHERE ??=?";
    var params = ["Cliente", "codigoCliente", req.params.codigoCliente];  
    db.execute(req, res, query, params, null);  
};

exports.getLoggedUser = function(req, res){    
    if(req.session.codigoCliente || req.cookies.findit_client_cookie){
        var codigoCliente = (req.
            session.codigoCliente) ? req.session.codigoCliente : req.cookies.findit_client_cookie; 
        var query = "SELECT * FROM ?? WHERE ??=?";
        var params = ["Cliente", "codigoCliente", codigoCliente];  
        db.execute(req, res, query, params, null);
    } else 
        res.json({"code" : 200});    
}

exports.isLogged = function(req, res){      
    var value = (req.session.codigoCliente) ? true : false;
    res.json({"code" : 200, "value" : value});
}

exports.logoff = function(req, res){  
    req.session.destroy();
    res.clearCookie("findit_client_cookie");
    res.redirect("/");
}

exports.login = function(req, res){
    let password = crypto.createHash('sha1').update(req.body.senhaCliente).digest("hex");
    var query = "SELECT * FROM ?? WHERE lcase(??) = ? and ?? = ?";
    var params = ["Cliente", "emailCliente", req.body.emailCliente,
                    "senhaCliente", password];  
    res = db.execute(req, res, query, params, validadeLogin);
};

validadeLogin = function(req, res, rows){
    if (rows.length == 1) {
        var client = {
            "codigoCliente" : rows[0].codigoCliente,
            "nomeCliente" : rows[0].nomeCliente,
            "emailCliente" : rows[0].emailCliente,
            "senhaCliente" : rows[0].senhaCliente, 
            "contatoCliente" : rows[0].contatoCliente, 
            "linkFotoCliente" : rows[0].linkFotoCliente
        }
        req.session.codigoCliente = rows[0].codigoCliente;
        if(req.body.continuarLogado)
            res.cookie('findit_client_cookie', rows[0].codigoCliente);        
        res.json({"error" : false, "client" : client});
    } else {
        res.json({"error" : true, "message" : 'Senha incorreta'});
    }
};





