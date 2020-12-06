const express = require('express');
const usersController = require('../controllers/usersController');


const usersRouter = express.Router();


function router() {

    const { getUserById, getProjectsOfLoggedInUser } = usersController();


    usersRouter.route('/:id').get(getUserById);
    usersRouter.route('/my/projects').get(getProjectsOfLoggedInUser);


    return usersRouter;
}

module.exports = router;
