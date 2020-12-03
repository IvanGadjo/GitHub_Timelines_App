// const debug = require('debug')('app:projectsController');
const mongooseConnection = require('../repository/mongoose');



function projectsController() {

    function getAllProjects(req, resp) {
        let projects = {};
        (async function getProjectsFromMongo() {
            const result = await mongooseConnection.getAllProjects();
            projects = result;
            resp.json(projects);
        }());
    }

    function createNewProject(req, resp) {
        (async function createNewProjectInMongo() {
            const result = await mongooseConnection.createNewProject(req, resp);
            resp.json(result);
        }());
    }

    function getProjectById(req, resp) {
        (async function getProjectByIdFromMongo() {
            const res = await mongooseConnection.getProjectById(req);
            resp.json(res);
        }());
    }

    function deleteProject(req, resp) {
        (async function deleteProjFromMongo() {
            const res = await mongooseConnection.deleteProject(req);
            resp.json(res);
        }());
    }

    function editProject(req, resp) {
        (async function editProjectInMongo() {
            const res = await mongooseConnection.editProject(req);
            resp.json(res);
        }());
    }

    return { getAllProjects, createNewProject, getProjectById, deleteProject, editProject };
}

module.exports = projectsController;

