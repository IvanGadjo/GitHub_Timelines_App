const express = require('express');
// const debug = require('debug')('app:gitReposRouter');
const gitReposController = require('../controllers/gitReposController');
const gitReposService = require('../services/gitReposService');




const gitReposRouter = express.Router();


function router() {
    const { 
        addGitRepoToProjectSegment,
        getRepoById,
        removeRepoFromSegmet,
        searchGitRepos,
        getConcreteGitRepo,
        searchGitUsers,
        getUserRepos,
        getCommitsFromRepo,
    } = gitReposController(gitReposService);

    // Authentication middleware
    gitReposRouter.use((req, resp, next) => {
        if (req.session.userToken)
            next();
        else
            resp.redirect('/');
    });

    // Only from model
    gitReposRouter.route('/addRepoToProjectSegment/:id').post(addGitRepoToProjectSegment);
    gitReposRouter.route('/:id').get(getRepoById);
    gitReposRouter.route('/removeRepoFromProjectSegment/:gitRepoId').delete(removeRepoFromSegmet);

    // with Github API
    gitReposRouter.route('/search/repos/:term').get(searchGitRepos);
    gitReposRouter.route('/search/users/:username/repos').get(getUserRepos);
    gitReposRouter.route('/search/repos/:username/:gitRepoName/commits').get(getCommitsFromRepo);
    gitReposRouter.route('/search/repos/:username/:gitRepoName').get(getConcreteGitRepo);
    gitReposRouter.route('/search/users/:term').get(searchGitUsers);
    


    return gitReposRouter;
}


module.exports = router;
