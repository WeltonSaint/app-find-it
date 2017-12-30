var Sequelize = require("sequelize"),
    config    = require("../config"),
    sequelize = new Sequelize(config.database, 
                config.username, config.password, config),
    models    = require("../models"),   
    Category  = models.category,
    Item      = models.item,
    ItemPhoto = models.itemPhoto,
    Status    = models.status;

exports.getAllItems = function(req, res){
    console.log(req.params.codigoCliente);
    Category.hasMany(Item, {foreignKey: 'codigoCategoria'});
    Item.belongsTo(Category, {foreignKey: 'codigoCategoria'});    
    Status.hasMany(Item, {foreignKey: 'codigoStatus'});
    Item.belongsTo(Status, {foreignKey: 'codigoStatus'});
    Item.findAll({
        attributes: [
            "codigoItem", 
            "nomeItem", 
            "dataCadastro",  
            "descricaoItem", 
            "latitudeItem", 
            "longitudeItem", 
            "raioItem"
        ],
        include: [{
            model: Category,
            attributes: [['nomeCategoria', 'nomeCategoria']]
        }, {
            model: Status,
            attributes: [['nomeStatus', 'nomeStatus']]
        }],
        where: {
            codigoCliente: req.params.codigoCliente
        },
        order:[[
            'dataCadastro',
            'DESC'
        ]]
    }).then(function(items) {
        var promises = items.map(function(item){
           return ItemPhoto.findAll({
                attributes: [
                    "linkFotoItem"
                ], where: {
                    codigoItem: item.codigoItem
                }
            }).then(function(photos) {
                let newPhotos = [];
                photos.forEach((photo) => {
                    newPhotos.push(photo.linkFotoItem);                    
                });
                return { 
                    "codigoItem" : item.codigoItem, 
                    "values" : newPhotos
                };
            });            
        });
        Sequelize.Promise.all(promises).then(function(promiseItems){
            var newItems = [];
            promiseItems.forEach((promiseItem) => {
                items.forEach((item) => {
                    if(item.codigoItem == promiseItem.codigoItem){             
                        let newItem = {
                            "codigoItem" : item.codigoItem, 
                            "nomeItem" : item.nomeItem, 
                            "dataCadastro" : item.dataCadastro,
                            "descricaoItem" : item.descricaoItem,
                            "latitudeItem" : item.latitudeItem, 
                            "longitudeItem" : item.longitudeItem, 
                            "raioItem" : item.raioItem, 
                            "nomeCategoria" : item.category.nomeCategoria, 
                            "nomeStatus" : item.status.nomeStatus, 
                            "fotosItem" : promiseItem.values
                        }
                        newItems.push(newItem);
                    }
                });
            });
            res.json(newItems);
        });                 
    }).catch(function(err) {     
        console.log("Error:", err);     
        res.json({
            error : true,
            message: "Ocorreu algum erro. Tente novamente"
        });     
    });       
};

exports.getLostItems = function(req, res){
    console.log(req.params.codigoCliente);
    Category.hasMany(Item, {foreignKey: 'codigoCategoria'});
    Item.belongsTo(Category, {foreignKey: 'codigoCategoria'});    
    Status.hasMany(Item, {foreignKey: 'codigoStatus'});
    Item.belongsTo(Status, {foreignKey: 'codigoStatus'});
    Item.findAll({
        attributes: [
            "codigoItem", 
            "nomeItem", 
            "dataCadastro",  
            "descricaoItem", 
            "latitudeItem", 
            "longitudeItem", 
            "raioItem"
        ],
        include: [{
            model: Category,
            attributes: [['nomeCategoria', 'nomeCategoria']]
        }, {
            model: Status,
            attributes: [['nomeStatus', 'nomeStatus']]
        }],
        where: {
            codigoCliente: req.params.codigoCliente,
            '$Status.nomeStatus$': 'Perdido'            
        },
        order:[[
            'dataCadastro',
            'DESC'
        ]]
    }).then(function(items) {
        var promises = items.map(function(item){
           return ItemPhoto.findAll({
                attributes: [
                    "linkFotoItem"
                ], where: {
                    codigoItem: item.codigoItem
                }
            }).then(function(photos) {
                let newPhotos = [];
                photos.forEach((photo) => {
                    newPhotos.push(photo.linkFotoItem);                    
                });
                return { 
                    "codigoItem" : item.codigoItem, 
                    "values" : newPhotos
                };
            });            
        });
        Sequelize.Promise.all(promises).then(function(promiseItems){
            var newItems = [];
            promiseItems.forEach((promiseItem) => {
                items.forEach((item) => {
                    if(item.codigoItem == promiseItem.codigoItem){             
                        let newItem = {
                            "codigoItem" : item.codigoItem, 
                            "nomeItem" : item.nomeItem, 
                            "dataCadastro" : item.dataCadastro,
                            "descricaoItem" : item.descricaoItem,
                            "latitudeItem" : item.latitudeItem, 
                            "longitudeItem" : item.longitudeItem, 
                            "raioItem" : item.raioItem, 
                            "nomeCategoria" : item.category.nomeCategoria, 
                            "nomeStatus" : item.status.nomeStatus, 
                            "fotosItem" : promiseItem.values
                        }
                        newItems.push(newItem);
                    }
                });
            });
            res.json(newItems);
        });                 
    }).catch(function(err) {     
        console.log("Error:", err);     
        res.json({
            error : true,
            message: "Ocorreu algum erro. Tente novamente"
        });     
    });       
};

exports.getFoundItems = function(req, res){
    console.log(req.params.codigoCliente);
    Category.hasMany(Item, {foreignKey: 'codigoCategoria'});
    Item.belongsTo(Category, {foreignKey: 'codigoCategoria'});    
    Status.hasMany(Item, {foreignKey: 'codigoStatus'});
    Item.belongsTo(Status, {foreignKey: 'codigoStatus'});
    Item.findAll({
        attributes: [
            "codigoItem", 
            "nomeItem", 
            "dataCadastro",  
            "descricaoItem", 
            "latitudeItem", 
            "longitudeItem", 
            "raioItem"
        ],
        include: [{
            model: Category,
            attributes: [['nomeCategoria', 'nomeCategoria']]
        }, {
            model: Status,
            attributes: [['nomeStatus', 'nomeStatus']]
        }],
        where: {
            codigoCliente: req.params.codigoCliente,
            '$Status.nomeStatus$': 'Encontrado'            
        },
        order:[[
            'dataCadastro',
            'DESC'
        ]]
    }).then(function(items) {
        var promises = items.map(function(item){
           return ItemPhoto.findAll({
                attributes: [
                    "linkFotoItem"
                ], where: {
                    codigoItem: item.codigoItem
                }
            }).then(function(photos) {
                let newPhotos = [];
                photos.forEach((photo) => {
                    newPhotos.push(photo.linkFotoItem);                    
                });
                return { 
                    "codigoItem" : item.codigoItem, 
                    "values" : newPhotos
                };
            });            
        });
        Sequelize.Promise.all(promises).then(function(promiseItems){
            var newItems = [];
            promiseItems.forEach((promiseItem) => {
                items.forEach((item) => {
                    if(item.codigoItem == promiseItem.codigoItem){             
                        let newItem = {
                            "codigoItem" : item.codigoItem, 
                            "nomeItem" : item.nomeItem, 
                            "dataCadastro" : item.dataCadastro,
                            "descricaoItem" : item.descricaoItem,
                            "latitudeItem" : item.latitudeItem, 
                            "longitudeItem" : item.longitudeItem, 
                            "raioItem" : item.raioItem, 
                            "nomeCategoria" : item.category.nomeCategoria, 
                            "nomeStatus" : item.status.nomeStatus, 
                            "fotosItem" : promiseItem.values
                        }
                        newItems.push(newItem);
                    }
                });
            });
            res.json(newItems);
        });                 
    }).catch(function(err) {     
        console.log("Error:", err);     
        res.json({
            error : true,
            message: "Ocorreu algum erro. Tente novamente"
        });     
    });       
};

exports.getReturnedItems = function(req, res){
    console.log(req.params.codigoCliente);
    Category.hasMany(Item, {foreignKey: 'codigoCategoria'});
    Item.belongsTo(Category, {foreignKey: 'codigoCategoria'});    
    Status.hasMany(Item, {foreignKey: 'codigoStatus'});
    Item.belongsTo(Status, {foreignKey: 'codigoStatus'});
    Item.findAll({
        attributes: [
            "codigoItem", 
            "nomeItem", 
            "dataCadastro",  
            "descricaoItem", 
            "latitudeItem", 
            "longitudeItem", 
            "raioItem"
        ],
        include: [{
            model: Category,
            attributes: [['nomeCategoria', 'nomeCategoria']]
        }, {
            model: Status,
            attributes: [['nomeStatus', 'nomeStatus']]
        }],
        where: {
            codigoCliente: req.params.codigoCliente,
            '$Status.nomeStatus$': 'Devolvido'            
        },
        order:[[
            'dataCadastro',
            'DESC'
        ]]
    }).then(function(items) {
        var promises = items.map(function(item){
           return ItemPhoto.findAll({
                attributes: [
                    "linkFotoItem"
                ], where: {
                    codigoItem: item.codigoItem
                }
            }).then(function(photos) {
                let newPhotos = [];
                photos.forEach((photo) => {
                    newPhotos.push(photo.linkFotoItem);                    
                });
                return { 
                    "codigoItem" : item.codigoItem, 
                    "values" : newPhotos
                };
            });            
        });
        Sequelize.Promise.all(promises).then(function(promiseItems){
            var newItems = [];
            promiseItems.forEach((promiseItem) => {
                items.forEach((item) => {
                    if(item.codigoItem == promiseItem.codigoItem){             
                        let newItem = {
                            "codigoItem" : item.codigoItem, 
                            "nomeItem" : item.nomeItem, 
                            "dataCadastro" : item.dataCadastro,
                            "descricaoItem" : item.descricaoItem,
                            "latitudeItem" : item.latitudeItem, 
                            "longitudeItem" : item.longitudeItem, 
                            "raioItem" : item.raioItem, 
                            "nomeCategoria" : item.category.nomeCategoria, 
                            "nomeStatus" : item.status.nomeStatus, 
                            "fotosItem" : promiseItem.values
                        }
                        newItems.push(newItem);
                    }
                });
            });
            res.json(newItems);
        });                 
    }).catch(function(err) {     
        console.log("Error:", err);     
        res.json({
            error : true,
            message: "Ocorreu algum erro. Tente novamente"
        });     
    });       
};