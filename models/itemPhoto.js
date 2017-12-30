module.exports = function(sequelize, Sequelize) {
 
    var ItemPhoto = sequelize.define('itemPhoto', {
 
        codigoFotoItem: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        }, 
        linkFotoItem: {
            type: Sequelize.STRING,
            notEmpty: true
        },         
    },
    {
        classMethods: {
            associate: function(models) {
                ItemPhoto.belongsTo(models.Item, { foreignKey: 'codigoItem' });
            }
        },
        timestamps: false,
        paranoid: true,
        tableName: 'FotoItem'
    });
   
    return ItemPhoto;
 
}