const express = require('express');
const usersController = require('../controllers/usersController');


const usersRouter = express.Router();


function router() {

    const { getUserById, getProjectsOfLoggedInUser, getGitReposOfLoggedInUser } = usersController();


    usersRouter.route('/:id').get(getUserById);
    usersRouter.route('/my/projects').get(getProjectsOfLoggedInUser);
    usersRouter.route('/my/gitRepos').get(getGitReposOfLoggedInUser);


    return usersRouter;
}

module.exports = router;
