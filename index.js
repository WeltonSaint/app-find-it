var express           = require("express"),    
    config            = require("./config"),
    routes            = require("./routes"),
    user              = require("./routes/user"),
    item              = require("./routes/item"),
    chat              = require("./routes/chat"),    
    http              = require("http"),
    path              = require("path"),
    passport          = require('passport'),
    multer            = require('multer'),
    jimp              = require("jimp"),
    gm                = require('gm'),
    cookieParser      = require('cookie-parser'),
    cookieSession     = require('cookie-session'),
    bodyParser        = require('body-parser'),
    session           = require('express-session'),
    port              = process.env.PORT || 80;
    router            = express.Router(),
    app               = express();  

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(session({
    secret              : config.secretSession,
    name                : config.nameSession,
    resave              : config.resaveSession,
    saveUninitialized   : config.saveUninitializedSession,
    proxy               : config.proxySession
}));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public/upload/');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({ storage : storage }).array('userPhoto',5);

/**
 * Routes access
 */
router.get("/", function (req, res) {
    if(req.cookies.findit_client_cookie || req.isAuthenticated()){
        user.getLoggedUser(req, res, function (req, res, user) {
            var value = "Meus Itens",
                option = "Todos os Itens: ";
                items = item.getAllItems(req, res, user, option, value, validateRenderIndex)
        });
    } else
        res.redirect("/login");       
});
router.get("/item/:option", function (req, res) {
    if(req.cookies.findit_client_cookie || req.isAuthenticated()){
        user.getLoggedUser(req, res, function (req, res, user) {
            var value,
                option,
                items;
            switch(req.params.option){
                case 'all':
                    option = "Todos os Itens: ";
                    value = "Meus Itens";
                    items = item.getAllItems(req, res, user, option, value, validateRenderIndex)
                    break;
                case 'lost':
                    option = "Itens Perdidos: ";
                    value = "Meus Itens Perdidos";
                    items = item.getLostItems(req, res, user, option, value, validateRenderIndex)
                    break;
                case 'found':
                    option = "Itens Encontrados: ";
                    value = "Meus Itens Encontrados";
                    items = item.getFoundItems(req, res, user, option, value, validateRenderIndex)
                    break;
                case 'returned':
                    option = "Itens Devolvidos: ";
                    value = "Meus Itens Devolvidos";
                    items = item.getReturnedItems(req, res, user, option, value, validateRenderIndex)
                    break;
                default:
                    routes.notFound(req,res);
                    break;
            }        
        });
    }  else
        res.redirect("/login");  
});
router.get("/chat/", function (req, res) {
    if(req.cookies.findit_client_cookie || req.isAuthenticated()){
        user.getLoggedUser(req, res, function (req, res, user) {            
            chat.getAllConversations(req, res, user, function (req, res, user, conversations) {
                chat.getAllMessages(req, res, user, conversations, function (req, res, user, conversations, messages) {                    
                    routes.chat(req, res, {
                        "user" : user,
                        "conversations": conversations,
                        "messages": messages
                    });
                });                
            });
        });
    } else
        res.redirect("/login");       
});
router.get("/insertItem/", routes.insertItem);
router.get("/login", routes.login);
router.get("/signup", routes.signup);
router.get("/forgot", routes.forgot);
router.get("/recover/:token", routes.recover);


/**
 * Requests user routes
 */
router.get("/users", user.getAllUsers);
router.get("/users/:codigoCliente", user.getUser);
router.post("/forgot/", user.forgot);
router.post("/users/", user.login);
router.post("/signup/", user.signup);
router.post("/loginSmartphone/", user.loginSmartphone);
router.post("/signupSmartphone/", user.signupSmartphone);
router.get('/logout', user.logout);
//router.get("/getLoggedUser", user.getLoggedUser);
router.post("/recoverPassword/", user.recoverPassword);
router.get("/auth/facebook", passport.authenticate("facebook",{ 
    scope : "email" 
}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { 
    successRedirect : '/', 
    failureRedirect : '/login' 
}),function(req, res) {        
    if (err) 
        return res.json(err);
    else if (!user) 
        return res.redirect('/login');
    else       
        return res.redirect('/');
});

router.get("/chat/conversation/:codigoCliente/", chat.getAllConversations);

/**
 * Requests items routes 
 */
/*router.get("/item/:option/:codigoCliente/", item.getAllItems);
router.get("/item/lost/:codigoCliente/", item.getLostItems);
router.get("/item/found/:codigoCliente/", item.getFoundItems);
router.get("/item/returned/:codigoCliente/", item.getReturnedItems);*/


app.post('/photo',function(req,res){
    upload(req, res, function(err) {
        if(err) {
            return res.end("Error uploading file. Error: " + err);
        }
        for (var key in req.files) {            
            if (req.files.hasOwnProperty(key)) {
                var width, height;
                var pathImg = req.files[key].path;
                console.log(pathImg);
                /*gm(pathImg).size(function (err, size) {
                  if (!err) {
                    width = size.width;
                    height = size.height;
                    console.log(size.width, size.height);
                  }
                  else{
                    return res.end(err); 
                  }
                });*/
                /*jimp.read(req.files[key].path).then(function (img) {
                    img.resize(getNewWidth(width, height), getNewHeight(width, height))            
                         .quality(60)
                         .write(Date.now() + ".jpg"); 
                }).catch(function (err) {
                    return res.end(err);
                });*/
            }
        }
        res.end("File is uploaded");
    });
});

/**
 * App uses routes defined
 */
app.use("/", router);
app.use("*", routes.notFound);

var server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);

validateRenderIndex = function (req, res, user, option, value, items) {
    routes.index(req, res, {
        "option" : option,
        "value" : value,
        "user" : user,
        "items": items
    });
};

function getSizeImage(pathImg) {
    return new Promise(function(resolve, reject) {
        gm(pathImg).size(function (err, size) {
            if (!err) {
              return { width : size.width, 
              height : size.height};
            }
          });
        resolve();
      });
}

function getNewWidth(width, height) {
    return (width >= height) ? 400 : Math.round((400 * width)/height);    
}

function getNewHeight(params) {
    return (width >= height) ? Math.round((400 * height)/width) : 400;
}