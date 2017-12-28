const mysql     = require("mysql"),
      config    = require("./config");

pool  =    mysql.createPool({
    connectionLimit   :   config.connectionLimit,
    host              :   config.host,
    user              :   config.username,
    password          :   config.password,
    database          :   config.database,
    debug             :   false
});

exports.execute = function(req, res, query, params, fun){
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }         
        query = mysql.format(query, params);
        connection.query(query, function(err,rows){
            connection.release();
            if(!err) {
                if(fun == null)
                    res.json(rows);
                else 
                    fun(req, res, rows);                              
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
    });    
}

exports.executeWithoutRes = function(req, query, params, fun){
    pool.getConnection(function(err,connection){
        if (err) { 
            console.log("err: " + err); 
            return;
        }         
        query = mysql.format(query, params);
        connection.query(query, function(err,rows){
            connection.release();
            if(!err) {
                if(fun != null)
                    fun(req, rows);                            
            }           
        });

        connection.on('error', function(err) {  
            return;     
        });
    });    
}