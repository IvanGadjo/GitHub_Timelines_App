const mongoose = require('mongoose');
const debug = require('debug')('app:mongoose');

const GitRepo = require('../models/gitRepo');
const Project = require('../models/project');

// connection

mongoose.connect('mongodb://localhost:27017/Github_Timelines_App_2_DB').then(() => {
    debug('Mongoose connection succesfull');
}).catch(() => {
    debug('Mongoose connection failed');
});



// methods

// -- Projects
const createNewProject = async (req) => {
    
    const newProject = new Project({
        name: req.body.name,
        status: req.body.status,
        segments: req.body.segments
    });

    debug(newProject);

    try {
        const result = await newProject.save();
        return result;
    } catch (error) {
        debug(error);
        return error;
    }
    
};

const editProject = async (req) => {
    const { id } = req.params;

    const newProject = {            // NOTE: ne pravis new Project() kako pri addNewProject
        name: req.body.name,
        status: req.body.status,
        segments: req.body.segments
    };

    const objectId = mongoose.Types.ObjectId(id);       // NOTE: Mongoose konverzija vo ObjectId

    try {           // NOTE: ova { new: true } pravi da se vrakja editiraniot objekt
        const result = await Project.findByIdAndUpdate(objectId, newProject, { new: true }).exec();
        return result;  
    } catch (error) {
        debug(error);
        return `Cannot edit the project with id ${id}`;
    }
};

const getAllProjects = async () => {
    const result = await Project.find().exec();
    return result;
};

const getProjectById = async (req) => {
    const { id } = req.params;
    try {
        const result = await Project.findById(id).exec();
        return result;   
    } catch (error) {
        debug(error);
        return `Cannot find the project with id ${id}`;
    }
};

const deleteProject = async (req) => {
    const { id } = req.params;
    try {
        const result = await Project.findByIdAndDelete(id).exec();
        return result;
    } catch (error) {
        debug(error);
        return `Cannot delete the project with id ${id}`;
    }
    
};
 
// -- Git Repos
const getRepoById = async (req) => {        // NOTE: Metodov ne raboti, bidejki sekoe repo se sejvnuva vo ramki na eden
                                            // projectSegment, a ne se pravi posebno collection za gitRepos
    const { id } = req.params;

    try {
        const result = await GitRepo.findById(id).exec();
        debug(result);
        return result;
    } catch (error) {
        const msg = `Cannot find git repo with the id ${id}`;
        return msg;
    }
};

const addRepoToProject = async (req) => {
    const { id } = req.params;      // project id

    const { segmentName } = req.body;

    const gitRepo = {
        name: req.body.name,
        owner: req.body.owner,
        numCommits: req.body.numCommits,
        createdAt: req.body.createdAt,
        url: req.body.url,
        commits: req.body.commits 
    }; 

    const objectId = mongoose.Types.ObjectId(id);

    try {
        const project = await Project.findById(id).exec();      // find the project

        const res = project.segments.filter(s => {      // find the segment needed
            if (s.name === segmentName) return true;
            return false;
        });
        res[0].gitRepos.push(gitRepo);          // add the repo to the segment
                                // NOTE: Samo go naogjas segmentot i mu stavas novo value. Tolku e. 
                                // Ne moras da mu go dodavas posle ovoj segment na proektot, samo znae deka e smeneto

        const result = await Project.findByIdAndUpdate(objectId, project, { new: true }).exec();
        return result;  
    } catch (error) {
        debug(error);
        return `Cannot add repo to the project with id ${id}`;
    }
};

const removeRepoFromProject = async (req) => {
    const { gitRepoId } = req.params;
    const { projectId, segmentId } = req.body;

    try {
        const project = await Project.findById(projectId).exec();   // find the project
        const theSegment = project.segments.filter(s => {       // find the segment needed
            return s.id === segmentId;
        })[0];                      // returns an array with one element, hence [0]

        const novo = theSegment.gitRepos.filter(r => {       // remove the repo
            return r.id !== gitRepoId;
        });

        theSegment.gitRepos = novo;     // add the new filtered array without the repo back to the segment
        
        const projectObjectId = mongoose.Types.ObjectId(projectId);
        const result = await Project.findByIdAndUpdate(projectObjectId, project, { new: true }).exec();
        return result;    

    } catch (err) {
        debug(err);
        return `Cannot remove repo from the project with id ${projectId}`;
    }
};








// FIXME: Test
const getAllGitRepos = async () => {
    const result = await GitRepo.find().exec();     // exec() go pretvara rezultatot vo promise za da mozes da napravis async await
    return result;
};


// FIXME: Test
const testNewRepo = async (req) => {

    // console.log(req.body);
    const newRepo = new GitRepo({
        name: req.body.name,
        owner: req.body.owner,
        numCommits: req.body.numCommits,
        createdAt: req.body.createdAt,
        url: req.body.url,
        // commits: req.body.commits
        commits: []
    });


    // console.log(newRepo);

    // newRepo.markModified('commits');

    const result = await newRepo.save();
    // res.json(result);
    return result;
};





module.exports.getAllGitRepos = getAllGitRepos;
module.exports.testNewRepo = testNewRepo;

module.exports.createNewProject = createNewProject;
module.exports.getAllProjects = getAllProjects;
module.exports.getProjectById = getProjectById;
module.exports.deleteProject = deleteProject;
module.exports.editProject = editProject;

module.exports.addRepoToProject = addRepoToProject;
module.exports.getRepoById = getRepoById;
module.exports.removeRepoFromProject = removeRepoFromProject;
