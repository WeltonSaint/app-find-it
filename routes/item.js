bodyParser  = require("body-parser")
db = require("../db");

exports.getAllItems = function(req, res){
    console.log(req.params.codigoCliente);
    var query = "SELECT ??, ??, TIMESTAMP(DATE_ADD(??, INTERVAL +5 HOUR)) as ??, ??, ??, ??, ??, ??, ??" +
                "FROM ?? natural join ?? natural join ?? " +
                "where ?? = ?";    
    var params = ["codigoItem", 
                    "nomeItem", 
                    "dataCadastro", 
                    "dataCadastro", 
                    "descricaoItem", 
                    "latitudeItem", 
                    "longitudeItem", 
                    "raioItem", 
                    "nomeCategoria", 
                    "nomeStatus",
                    "item",
                    "categoria",
                    "status",
                    "codigoCliente",
                    req.params.codigoCliente
                    ];
    db.execute(req, res, query, params);        
        
};

exports.getIdItem = function(req, res){
    var query = "SELECT * FROM ?? WHERE ??=?";
    var params = ["users","user_id",req.params.user_id];  
    db.execute(req, res, query, params);
};