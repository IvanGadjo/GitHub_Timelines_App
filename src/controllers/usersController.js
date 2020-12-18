const debug = require('debug')('app:usersController');
const mongooseConnection = require('../repository/mongoose');
const gitReposService = require('../services/gitReposService');

function usersController() {

    function createNewUser(gitUsername, gitUrl, gitAvatarUrl, projectIds, followingGitRepos) {

        (async function createNewUserInMongo() {
            const result = await mongooseConnection.createNewUser(gitUsername, gitUrl, gitAvatarUrl,
                projectIds, followingGitRepos);
            // return result;
            debug(result);
        }());
    }

    function getUserById(req, resp) {

        (async function getUserByIdFromMongo() {
            const result = await mongooseConnection.getUserById(req);
            resp.json(result);
        }());
    }   

    function getProjectsOfLoggedInUser(req, resp) {
        (async function getProjsOfUserFromMongo() {
            const result = await mongooseConnection.getProjectsOfLoggedInUser(req);
            resp.json(result);
        }());
    }

    function getGitReposOfLoggedInUser(req, resp) {
        (async function getGitReposOfUserFromService() {
            const result = await gitReposService.getGitReposOfLoggedInUser(req);
            // debug(result);
            resp.json(result);
        }());
    }

    return { createNewUser, 
             getUserById, 
             getProjectsOfLoggedInUser,
             getGitReposOfLoggedInUser };
}

module.exports = usersController;
