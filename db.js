const mysql   = require("mysql");

pool  =    mysql.createPool({
    connectionLimit   :   100,
    host              :   'mysql4.gear.host',
    user              :   'findit',
    password          :   'Eg2g!-W11i3n',
    database          :   'findit',
    debug             :   false
});

exports.execute = function(req, res, query, params, fun){
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }         
        query = mysql.format(query, params);
        console.log("query: " + query);
        connection.query(query, function(err,rows){
            connection.release();
            if(!err) {
                if(fun == null)
                    res.json(rows);
                else {
                    fun(req, res, rows);
                }              
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
    });    
}