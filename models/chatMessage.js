module.exports = function(sequelize, Sequelize) {
 
    var ChatMessage = sequelize.define('chatMessage', {
        codigoClienteDestinatario: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
        codigoClienteRemetente: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },         
        dataEnvio: {
            type: Sequelize.DATE,
            notEmpty: true,
            defaultValue: Sequelize.NOW 
        },
        conteudoMensagem: {
            type: Sequelize.BLOB,
            notEmpty: true
        },         
        dataVisualizado: {
            type: Sequelize.DATE,
            notEmpty: true, 
        },
        notificadoMensagem: { 
            type: Sequelize.BOOLEAN,
            allowNull: false, 
            defaultValue: false 
        }
    },
    {
        classMethods: {
            associate: function(models) {     
            }
        },
        timestamps: false,
        paranoid: true,
        tableName: 'ChatMensagem'
    });
   
    return ChatMessage;
 
}