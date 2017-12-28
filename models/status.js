module.exports = function(sequelize, Sequelize) {
 
    var Status = sequelize.define('status', {
 
        codigoStatus: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        }, 
        nomeStatus: {
            type: Sequelize.STRING,
            notEmpty: true
        } 
        
    },
    {
        classMethods: {
          associate: function(models) {
          }
        },
        timestamps: false,
        paranoid: true,
        tableName: 'Status'
    });
 
    return Status;
 
}