const express = require('express');
const usersController = require('../controllers/usersController');


const usersRouter = express.Router();


function router() {

    const { getUserById, getProjectsOfLoggedInUser, getGitReposOfLoggedInUser } = usersController();


    // Authentication middleware
    usersRouter.use((req, resp, next) => {
        if (req.session.userToken)
            next();
        else
            resp.redirect('/');
    });

    usersRouter.route('/:id').get(getUserById);
    usersRouter.route('/my/projects').get(getProjectsOfLoggedInUser);
    usersRouter.route('/my/gitRepos').get(getGitReposOfLoggedInUser);


    return usersRouter;
}

module.exports = router;
