module.exports = function(sequelize, Sequelize) {

    var Item = sequelize.define('item', {
 
        codigoItem: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        }, 
        nomeItem: {
            type: Sequelize.STRING,
            notEmpty: true
        }, 
        descricaoItem: {
            type: Sequelize.TEXT,
            notEmpty: true
        }, 
        dataCadastro: {
            type: Sequelize.DATE,
            notEmpty: true,
            defaultValue: Sequelize.NOW 
        },
        latitudeItem: {
            type: Sequelize.FLOAT(10, 7),
            notEmpty: true 
        },
        latitudeItem: {
            type: Sequelize.FLOAT(10, 7),
            notEmpty: true 
        },
        raioItem: {
            type: Sequelize.FLOAT,
            notEmpty: true 
        }        
    },
    {
        classMethods: {
          associate: function(models) {
            Item.hasOne(models.Category, { foreignKey: 'codigoCategoria' });
            Item.hasOne(models.Status, { foreignKey: 'codigoStatus' });
            Item.hasOne(models.User, { foreignKey: 'codigoCliente' });
          }
        },
        timestamps: false,
        paranoid: true,
        tableName: 'Item'
    });

    return Item;
 
}