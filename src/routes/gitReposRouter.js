const express = require('express');
// const debug = require('debug')('app:gitReposRouter');
const gitReposController = require('../controllers/gitReposController');
const gitReposService = require('../services/gitReposService');




const gitReposRouter = express.Router();


function router() {
    const { 
        addGitRepoToProjectSegment,
        removeRepoFromSegmet,
        searchGitRepos,
        getConcreteGitRepo,
        searchGitUsers,
        getUserRepos,
        getCommitsFromRepo,
        addNoteToRepo,
        removeNoteFromRepo,
        createNewRepo
    } = gitReposController(gitReposService);


    // TODO: Bidejki e istata fukncija vo sekoj ruter, mozes da ja izvadis vo nov file za middleware,
    // pa import na istata, i ja davas kako param na ova myRouter.use()
    // Authentication middleware
    gitReposRouter.use((req, resp, next) => {
        if (req.session.userToken)
            next();
        else
            resp.redirect('/');
    });

    // Only from model
    gitReposRouter.route('/addRepoToProjectSegment/:id').post(addGitRepoToProjectSegment);
    gitReposRouter.route('/removeRepoFromProjectSegment/:gitRepoId').delete(removeRepoFromSegmet);
    gitReposRouter.route('/addNote/:repoId').post(addNoteToRepo);
    gitReposRouter.route('/removeNote/:repoId').delete(removeNoteFromRepo);
    

    // with Github API
    gitReposRouter.route('/search/repos/:term').get(searchGitRepos);
    gitReposRouter.route('/search/users/:username/repos').get(getUserRepos);
    gitReposRouter.route('/search/repos/:username/:gitRepoName/commits').get(getCommitsFromRepo);
    gitReposRouter.route('/search/repos/:username/:gitRepoName').get(getConcreteGitRepo);
    gitReposRouter.route('/search/users/:term').get(searchGitUsers);

    // gitReposRouter.route('/createNewRepo').post(createNewRepo);
    gitReposRouter.route('/createNewRepo').get(createNewRepo);    


    return gitReposRouter;
}


module.exports = router;
