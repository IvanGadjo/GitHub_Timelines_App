const express = require('express');
const debug = require('debug')('app:projectsRouter');
const projectsController = require('../controllers/projectsController');


const projectsRouter = express.Router();

function router(message) {

    debug(message);

    const { getAllProjects, createNewProject, getProjectById, deleteProject, editProject } = projectsController();

    projectsRouter.route('/').get(getAllProjects);
    projectsRouter.route('/createNewProject').post(createNewProject);
    projectsRouter.route('/:id').get(getProjectById);
    projectsRouter.route('/editProject/:id').put(editProject);
    projectsRouter.route('/:id').delete(deleteProject);

    return projectsRouter;
}

module.exports = router;

