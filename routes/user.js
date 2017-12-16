var db = require("../db");
var crypto = require('crypto');
var sender = "smtps://email.find.it%40gmail.com";
var password = "@appFindIt";

var nodeMailer = require("nodemailer");
var EmailTemplate = require("email-templates").EmailTemplate;

var transporter = nodeMailer.createTransport(sender + ':' + password + '@smtp.gmail.com');

var sendResetPasswordLink = transporter.templateSender(
  new EmailTemplate('views/templates/resetPassword'), {
    	from: "support@app-find-it.herokuapp.com",
  });


exports.getAllUsers = function(req, res){
    var query = "SELECT * FROM ??";
    var params = ["Cliente"];
    db.execute(req, res, query, params, null);        
        
};

exports.getUser = function(req, res){
    var query = "SELECT * FROM ?? WHERE ?? = ?";
    var params = ["Cliente", "codigoCliente", req.params.codigoCliente];  
    db.execute(req, res, query, params, null);  
};

exports.forgot = function(req, res){
    var query = "SELECT * FROM ?? WHERE lcase(??) = ?";
    var params = ["Cliente", "emailCliente", req.body.emailCliente]; 
    db.execute(req, res, query, params, validadeForgot);  
}

sendPasswordReset = function (req, res, email, username, tokenUrl) {
    // transporter.template
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
                "message" : "Será enviado um e-mail para você cadastrar uma nova senha"});            
        }
    });
};

exports.recoverPassword = function(req, res){
    let password = crypto.createHash('sha1')
                .update(req.body.senhaCliente).digest("hex");
    var query = "update ?? set ?? = ? WHERE sha1(lcase(??)) = ?";
    var params = ["Cliente", "senhaCliente", password, 
                    "emailCliente", req.body.token];  
    res = db.execute(req, res, query, params, validadeRecoverPassword);
} 

exports.getLoggedUser = function(req, res){    
    if(req.session.codigoCliente || req.cookies.findit_client_cookie){
        var codigoCliente = (req.
            session.codigoCliente) 
                ? req.session.codigoCliente 
                : req.cookies.findit_client_cookie; 
        var query = "SELECT * FROM ?? WHERE ??=?";
        var params = ["Cliente", "codigoCliente", codigoCliente];  
        db.execute(req, res, query, params, null);
    } else 
        res.json({"code" : 200});    
}

exports.login = function(req, res){
    handleIsExistEmail(req, res, handleLogin);
};

exports.signup = function(req, res){
    handleIsExistEmail(req, res, handleSignUp);
};

exports.logoff = function(req, res){  
    req.session.destroy();
    res.clearCookie("findit_client_cookie");
    res.redirect("/login");
}

handleIsExistEmail = function (req, res, fun) {
    var query = "SELECT * FROM ?? WHERE lcase(??) = ?";
    var params = ["Cliente", "emailCliente", req.body.emailCliente];  
    res = db.execute(req, res, query, params, fun);
}

handleLogin = function(req, res, rows){
    if (rows.length == 0)
        res.json({"error" : true,
             "message" : "Não existe nenhum usuário com este e-mail!"});
    else{
        let password = crypto.createHash('sha1')
                    .update(req.body.senhaCliente).digest("hex");
        var query = "SELECT * FROM ?? WHERE lcase(??) = ? and ?? = ?";
        var params = ["Cliente", "emailCliente", req.body.emailCliente,
                    "senhaCliente", password];  
        res = db.execute(req, res, query, params, validadeLogin);
    }    
}

handleSignUp = function(req, res, rows){
    if (rows.length != 0)
        res.json({"error" : true,
             "message" : "Já existe um usuário com este e-mail!"});
    else{
        let password = crypto.createHash('sha1')
                    .update(req.body.senhaCliente).digest("hex");
        var query = "INSERT into ?? (??, ??, ??) values (?, ?, ?)";
        var params = ["Cliente", "nomeCliente", "emailCliente",
                     "senhaCliente", req.body.nomeCliente,
                      req.body.emailCliente, password];  
        res = db.execute(req, res, query, params, validadeSignUp);
    }    
}


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
    } else 
        res.json({"error" : true, "message" : 'Senha incorreta'});    
};

validadeSignUp = function (req, res, rows){
    if(rows.affectedRows == 1)
        res.json({"error" : false,
            "message" : "Usuário cadastrado com sucesso!"});
    else
        res.json({"error" : true, "message" : "Não foi possível cadastrar este usuário. Tente novamente!"});
}

validadeRecoverPassword = function(req, res, rows){
    if(rows.affectedRows == 1)
        res.json({"error" : false,
             "message" : "Senha alterada com sucesso!"});
    else
        res.json({"error" : true, "message" : "Não foi possível alterar sua senha. Tente novamente!"});
    
}

validadeForgot = function(req, res, rows){
    if (rows.length != 1) 
        res.json({"error" : true,
             "message" : "Não existe nenhum usuário com este e-mail!"});
    else {
        email = req.body.emailCliente;
        let tokenUrl = crypto.createHash('sha1')
                    .update(email.toLowerCase()).digest("hex");
        sendPasswordReset(req, res, email.toLowerCase(),
                     rows[0].nomeCliente, tokenUrl);
    }
}





