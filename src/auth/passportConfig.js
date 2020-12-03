/* eslint-disable function-paren-newline */
/* eslint-disable prefer-arrow-callback */


// This passport config is unused, since passport is not needed in the project

const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const debug = require('debug')('app:passportConfig');
require('dotenv').config();


const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});



passport.use(new GithubStrategy({
    clientID: clientId,
    clientSecret,
    callbackURL: 'http://localhost:3000/auth/github/callback'
}, 
    function (accessToken, refreshToken, profile, done) {
        // To keep the example simple, the user's GitHub profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the GitHub account with a user record in your database,
        // and return that user instead.

            // if (!user) {
            //     user = User.forge({ username: profile.username })
            //   }
            // 
            //   user.save({ profile: profile, access_token: accessToken }).then(() => {
            //     return done(null, user)
            //   })

        debug('Vnatre vo passport.js!!');    

        return done(null, profile);
    }
));







