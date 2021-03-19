const express = require('express');
const debug = require('debug')('app:authRouter');
const axios = require('axios');
const usersController = require('../controllers/usersController');
require('dotenv').config();


const authRouter = express.Router();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;




// NOTE: Full oAuth flow for authentication with GitHub



function router() {    

    const { createNewUser } = usersController();



    let token = null;

    

    // login
    authRouter.route('/').get((req, resp) => {      // NOTE: prv povik za da zeme code
        resp.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`);
    });

    authRouter.route('/github/callback').get((req, res) => {    // NOTE: Prethodniot povik zavrsuva na ovoj callback
        debug('POVIK 1');
        debug(req.query.code);

        const body = {
            client_id: clientId,
            client_secret: clientSecret,
            code: req.query.code
        };
        const opts = { headers: { accept: 'application/json' } };

        axios.post('https://github.com/login/oauth/access_token', body, opts)   // NOTE: vtor povik so code, za da zeme token
            .then(resp => {
                debug('POVIK 2.1');
                debug(resp.data.access_token);
                return resp.data.access_token;
            })
            .then(_token => {
                debug('POVIK 2.2');
                token = _token;
                debug('My token:', token);

                req.session.userToken = token;

                // res.redirect('/projects');


                return token;
            })
            .then(tok => {           // NOTE: Sega preku tokenot zema info za user i go kreira vo db ako ne postoi    
                                    // NOTE: Vaka povici so tokenot

                axios.get('https://api.github.com/user', {
                    headers: {
                        authorization: `token ${tok}`
                    }
                })
                .then(respo => {

                    // const { createNewUser } = usersController;

                    debug(respo.data.login);
                    const gitUsername = respo.data.login;
                    const gitUrl = respo.data.html_url;
                    const gitAvatarUrl = respo.data.avatar_url;
                    const projectIds = [];
                    const followingGitRepos = [];

                    req.session.userName = gitUsername;
                    
                    // povik na metod od userscontroler za new user
                    // eslint-disable-next-line no-unused-vars
                    const noviot = createNewUser(gitUsername, gitUrl, gitAvatarUrl, projectIds, followingGitRepos);

                    res.redirect('/projects');
                });
            })
            .catch(err => {
                res.status(500).json({ message: err.message });
            });
    });

    // logout
    authRouter.route('/logout').get((req, resp) => {
        req.session.destroy();
        resp.redirect('/');     // redirect na home page
    });

    // FIXME: zatvori go ovoj endpoint na kraj
    authRouter.route('/getUserToken').get((req, resp) => {
        resp.send(req.session.userToken);
    });


    return authRouter;
}

module.exports = router;




