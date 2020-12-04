const express = require('express');
const debug = require('debug')('app:authRouter');
const axios = require('axios');
// const session = require('express-session');
require('dotenv').config();


const authRouter = express.Router();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;




function router() {    

    let token = null;

    authRouter.route('/').get((req, resp) => {
        resp.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`);
    });

    authRouter.route('/github/callback').get((req, res) => {
        debug('POVIK 1');
        debug(req.query.code);

        const body = {
            client_id: clientId,
            client_secret: clientSecret,
            code: req.query.code
        };
        const opts = { headers: { accept: 'application/json' } };

        axios.post('https://github.com/login/oauth/access_token', body, opts)
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

                res.redirect('/projects');


                // return token;
            })
            // .then(tok => {               // NOTE: Vaka povici so tokenot
                

            //     axios.get('https://api.github.com/user/repos', {
            //         headers: {
            //             authorization: `token ${tok}`
            //         }
            //     }).then(respo => {
            //         debug(respo.data[0]);
            //         debug(respo.data[1]);

            //         res.json({ ok: 1 });
            //     });
            // })
            .catch(err => {
                res.status(500).json({ message: err.message });
            });
    });

    authRouter.route('/getUserToken').get((req, resp) => {
        resp.send(req.session.userToken);
    });


    return authRouter;
}

module.exports = router;




