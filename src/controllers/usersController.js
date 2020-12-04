const debug = require('debug')('app:usersController');
const mongooseConnection = require('../repository/mongoose');


function usersController() {

    function createNewUser(gitUsername, gitUrl, gitAvatarUrl, projectIds, followingGitRepos) {

        (async function createNewUserInMongo() {
            const result = await mongooseConnection.createNewUser(gitUsername, gitUrl, gitAvatarUrl,
                projectIds, followingGitRepos);
            // return result;
            debug(result);
        }());
    }

    function getUserById() {

    }

    return { createNewUser, getUserById };
}

module.exports = usersController;
