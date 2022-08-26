const fs = require('fs'); 
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory)  || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access_log',{
    interval: '1d',
    path: logDirectory
});



const development = {
    name: 'development',
    asset_path: process.env.CODEIAL_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: process.env.CODEIAL_SERVICE,
        host: process.env.CODEIAL_HOST,
        port:process.env.CODEIAL_PORT,
        secure:process.env.CODEIAL_SECURE,
        auth: {
            user:process.env.CODEIAL_USER,
            pass: process.env.CODEIAL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CID,
    google_client_secret: process.env.CODEIAL_G_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,

    morgan:{
        mode:'dev',
        options: {stream:accessLogStream}
    }

}




const production =  {
    name: 'production',



    morgan:{
        mode:'combined',
        options: {stream:accessLogStream}
    }

}



module.exports = development;