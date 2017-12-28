var express           = require("express"),    
    config            = require("./config"),
    routes            = require("./routes"),
    user              = require("./routes/user"),
    item              = require("./routes/item"),    
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

router.get("/", routes.index);
router.get("/insertItem/", routes.insertItem);
router.get("/login", routes.login);
router.get("/signup", routes.signup);
router.get("/forgot", routes.forgot);
router.get("/recover/:token", routes.recover);
router.get("/chat/:user_id", routes.chat);
router.get("/users", user.getAllUsers);
router.get("/users/:codigoCliente", user.getUser);
router.post("/forgot/", user.forgot);
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
router.post("/users/", user.login);
router.post("/signup/", user.signup);
router.get('/logout', user.logout);

router.get("/getLoggedUser", user.getLoggedUser);
router.post("/recoverPassword/", user.recoverPassword);
router.get("/item/:codigoCliente/", item.getAllItems);
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

app.use("/", router);
app.use("*", routes.notFound);

var server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);

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