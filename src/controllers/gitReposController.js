// const debug = require('debug')('app:gitReposController');
const mongooseConnection = require('../repository/mongoose');


function gitReposController(gitReposService) {

    // Using Githubs Api

    function searchGitRepos(req, resp) {
        const { term } = req.params;
        const { numPage } = req.body;
      
        (async function searchReposFromGit() {
            const result = await gitReposService.searchGitRepos(term, numPage);
            resp.json(result);
        }());
    }

    function getConcreteGitRepo(req, resp) {
        const { username, gitRepoName } = req.params;
        
        (async function getRepoFromGit() {
            const result = await gitReposService.getConcreteGitRepo(username, gitRepoName);
            resp.json(result);
        }());
    }

    function searchGitUsers(req, resp) {
        const { term } = req.params;
        const { numPage } = req.body;

        (async function searchUsersInGit() {
            const result = await gitReposService.searchGitUsers(term, numPage);
            resp.json(result);
        }());
    }

    function getUserRepos(req, resp) {
        const { username } = req.params;
        const { numPage } = req.body;

        (async function searchUsersInGit() {
            const result = await gitReposService.getUserRepos(username, numPage);
            resp.json(result);
        }());
    }
    
    function getCommitsFromRepo(req, resp) {
        const { username, gitRepoName } = req.params;
        (async function getCommitsFromRepoInGit() {
            // const result = await gitReposService.getCommitsFromRepo(username, gitRepoName);
            // resp.json(result);
            resp.json(await gitReposService.getCommitsFromRepo(username, gitRepoName));
        }());
    }

    function createNewRepo(req, resp) {
        (async function createNewRepoOnGit() {
            const result = await gitReposService.createGitRepo(req);
            resp.json(result);
        }());
    }


    // Only from model

    function addGitRepoToProjectSegment(req, resp) {
        (async function addRepoToSegInMongo() {
            const result = await mongooseConnection.addRepoToProject(req);
            resp.json(result);
        }());
    }

    function removeRepoFromSegmet(req, resp) {
        (async function removeRepoFromSegmentFromMongo() {
            const result = await mongooseConnection.removeRepoFromProject(req);
            resp.json(result);
        }());
    }

    function addNoteToRepo(req, resp) {
        (async function addNoteInMongo() {
            const result = await mongooseConnection.addNoteToRepo(req);
            resp.json(result);
        }());
    }

    function removeNoteFromRepo(req, resp) {
        (async function removeNoteFromMongo() {
            const result = await mongooseConnection.removeNoteFromRepo(req);
            resp.json(result);
        }());
    }



    return { 
        searchGitRepos,
        getConcreteGitRepo,
        searchGitUsers,
        getUserRepos,
        getCommitsFromRepo,
        addGitRepoToProjectSegment, 
        removeRepoFromSegmet,
        addNoteToRepo,
        removeNoteFromRepo,
        createNewRepo
    };
}

module.exports = gitReposController;
