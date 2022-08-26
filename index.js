// require('dotenv').config();
const express = require('express');
const env = require('./config/environment');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');



const app = express();
// app.use(cors({credentials: true, origin: 'http://localhost:5000'}));
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');



//Used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware =require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const io = require('socket.io')(chatServer);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path');

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//     next();
// });

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
    
}




app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static(env.asset_path));

//make the uploads path available to browser
app.use('/uploads',express.static(__dirname + '/uploads'));
app.use(expressLayouts);

app.use(logger(env.morgan.mode, env.morgan.options))


//extract style and scripts from sub pages into the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);




//setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the DB
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongoUrl:'mongodb://localhost/codeial_development',
        autoRemove:'disabled'
    },function(err){
        console.log(err || 'Connect MongoDB setup OK');
    })
    

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express Router
app.use('/',require('./routes'));


app.listen(port,function(err){
    if (err){
        console.log('Error',err)
        console.log(`Error in running the server: ${err}`);
    }
    console.log(process.env.port);
    console.log(`Server is running on port: ${port}`);

})