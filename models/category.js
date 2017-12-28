module.exports = function(sequelize, Sequelize) {
 
    var Category = sequelize.define('category', {
 
        codigoCategoria: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        nomeCategoria: {
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
        tableName: 'Categoria'
    });
 
    return Category;
 
}