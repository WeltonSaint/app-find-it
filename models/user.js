module.exports = function(sequelize, Sequelize) {
 
    var User = sequelize.define('user', {
 
        codigoCliente: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        }, 
        nomeCliente: {
            type: Sequelize.STRING,
            notEmpty: true
        }, 
        emailCliente: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        }, 
        senhaCliente: {
            type: Sequelize.STRING,
            allowNull: false
        },
        linkFotoCliente: {
            type: Sequelize.STRING
        }, 
        ultimaAtividade: {
            type: Sequelize.DATE
        }
         
    },
    {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Item, {foreignKey: 'codigoCliente'});                
            }
        },
        timestamps: false,
        paranoid: true,
        tableName: 'Cliente'
    });
   
    return User;
 
}