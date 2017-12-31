module.exports = function(sequelize, Sequelize) {
 
    var Conversation = sequelize.define('conversation', {
        codigoClienteDestinatario: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
        codigoClienteRemetente: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },   
        nomeCliente: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        linkFotoCliente: {
            type: Sequelize.STRING
        }, 
        ultimaMensagem: {
            type: Sequelize.BLOB,
            notEmpty: true
        },         
        dataEnvio: {
            type: Sequelize.DATE,
            notEmpty: true, 
        },
        novasMensagens: {
            type: Sequelize.INTEGER,
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
        tableName: 'Conversa'
    });
   
    return Conversation;
 
}