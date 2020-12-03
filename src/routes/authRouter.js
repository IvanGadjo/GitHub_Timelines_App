const express = require('express');
const debug = require('debug')('app:authRouter');
const axios = require('axios');
require('dotenv').config();


const authRouter = express.Router();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;


function router() {    

    let token = null;

    authRouter.route('/').get((req, resp) => {
        resp.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}`);
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
            // .then(resp => resp.data['access_token'])
            .then(_token => {
                debug('POVIK 2.2');
                token = _token;
                debug('My token:', token);
                // res.json({ ok: 1 });
                res.redirect('/projects');
            })
            .catch(err => {
                res.status(500).json({ message: err.message });
            });
    });



    return authRouter;
}

module.exports = router;




