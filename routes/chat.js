var Sequelize     = require("sequelize"),
    config        = require("../config"),
    sequelize     = new Sequelize(config.database, 
                config.username, config.password, config),
    models        = require("../models"),
    Conversation  = models.conversation;
    ChatMessage  = models.chatMessage;  

exports.getAllConversations = function (req, res, user, fun){
    Conversation.findAll({
        attributes: [
            "codigoClienteDestinatario", 
            "nomeCliente", 
            "linkFotoCliente", 
            "ultimaMensagem", 
            "dataEnvio", 
            "novasMensagens"
        ],
        where: {
            codigoClienteRemetente: user.codigoCliente
        },
        order:[[
            "dataEnvio",
            "DESC"
        ]]
    }).then(function(conversations) {
        var newConv = [];
        conversations.forEach(conversation => {
            let conv = {
                codigoClienteDestinatario : conversation.codigoClienteDestinatario,
                nomeCliente : conversation.nomeCliente,
                linkFotoCliente : conversation.linkFotoCliente,
                ultimaMensagem : conversation.ultimaMensagem.toString('utf8'),
                dataEnvio : conversation.dataEnvio,
                novasMensagens : conversation.novasMensagens
            }
            newConv.push(conv);
        });
        fun(req, res, user, newConv);
    }).catch(function(err) {     
        console.log("Error:", err);     
        return {
            error : true,
            message: "Ocorreu algum erro. Tente novamente"
        };     
    }); 
};

exports.getAllMessages = function (req, res, user, conversations, fun){  
    ChatMessage.findAll({
        attributes: [
            "codigoClienteRemetente",
            "dataEnvio", 
            "conteudoMensagem",
        ],
        where: Sequelize.or(
            Sequelize.and(
                { codigoClienteRemetente: user.codigoCliente},
                { codigoClienteDestinatario: conversations[0].codigoClienteDestinatario}
            ),
            Sequelize.and(
                { codigoClienteRemetente: conversations[0].codigoClienteDestinatario },
                { codigoClienteDestinatario: user.codigoCliente }
        )),
        order:[[
            "dataEnvio"
        ]]
    }).then(function(messages) {
        var newMsg = [];
        messages.forEach(message => {
            "codigoClienteRemetente",
            "dataEnvio", 
            "conteudoMensagem"
            let msg = {
                codigoClienteRemetente : message.codigoClienteRemetente,
                conteudoMensagem : message.conteudoMensagem.toString('utf8'),
                dataEnvio : message.dataEnvio
            }
            newMsg.push(msg);
        });
        fun(req, res, user, conversations, newMsg);
    }).catch(function(err) {     
        console.log("Error:", err);     
        return {
            error : true,
            message: "Ocorreu algum erro. Tente novamente"
        };     
    }); 
};