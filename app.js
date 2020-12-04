const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
require('dotenv').config();





const app = express();


// -- Global vars
const serverUrl = process.env.SERVER_URL || 'localhost:3000';
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET;

// const baseRoutes = {
//     HOME: '/home',
//     EXPLORE: '/explore',
//     'MY LOADOUT': '/myLoadout'
// };


const demoMsg = 'Poraka od app.js do projectsRouter';
const gitReposRouter = require('./src/routes/gitReposRouter')();
const projectsRouter = require('./src/routes/projectsRouter')(demoMsg);
const authRouter = require('./src/routes/authRouter')();







// -- App middleware
// --- Static resources
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public')));       // NOTE: express.static serves static assets such as HTML files, images
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css'))); // NOTE: ako dodades path nekoj pred nego na toj path ke se serve static files
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

// -- Session Management
mongoose.connect('mongodb://localhost:27017/Github_Timelines_App_2_DB').then(() => {
    debug('Mogoose connection succesfull from APP.js'); 
}).catch(() => {
    debug('Mongoose connection failed from APP.js');
});
app.use(session({
    secret: sessionSecret,      // It holds the secret key for session 
    resave: true,               // Forces the session to be saved back to the session store 
    saveUninitialized: true,    // Forces a session that is "uninitialized" to be saved to the store 
    store: new MongoStore({     // The session data is stored in mongoDb. Expiration = 14 days by default
        mongooseConnection: mongoose.connection
    })
}));

// --- Routers
app.use('/auth', authRouter);
app.use('/gitRepos', gitReposRouter);
app.use('/projects', projectsRouter);







// -- App sets
app.set('views', './src/views');
app.set('view engine', 'ejs');



app.get('/', (req, resp) => {
    resp.send('HOME PAGE');
});


app.listen(port, () => {
    debug(`Running on ${serverUrl}`);
});





// TODO: 
// *1. CRUD za proekti i segmenti
// *2. API SERVICE - da moze git repos da searcha od api
// *3. da moze da dodade git repo na segment na proekt
// *4. AUTH - oAuth bez passport
// *5. Hide global vars
// *6. dodaj stvari na gitRepo model (notes, description ...)
// *7. Probaj so token da dobies info za nekoi repos
// 8. Model za user (following repos, projects, git acc)
// 9. Kreiranje proekt preku user
// *9.1 Zacuvuvanje na userot i tokenot nekako vo sesija
// 10. Probaj da add vistinsko repo na proekt
// 11. Da moze da follownes repos
// 12. Za pageot myRepos - metod sto gi lista site repos od tvojot git acc
// 13. Za pageot myFollowingRepos - metod sto gi lista site following repos na toj acc

// 14. Create gitRepo - preku git acc da moze da napravi repo


// Next: Mongo
// Next: Redux & Hooks
// Next: React frontend with best practices


// da moze upload na slika/dokument nekakov
// da moze da bira avatar od api (random da dava)


