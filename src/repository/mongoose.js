const mongoose = require('mongoose');
const debug = require('debug')('app:mongoose');

const GitRepo = require('../models/gitRepo');
const Project = require('../models/project');
const user = require('../models/user');
const User = require('../models/user');

// connection

mongoose.connect('mongodb://localhost:27017/Github_Timelines_App_2_DB').then(() => {
    debug('Mongoose connection succesfull');
}).catch(() => {
    debug('Mongoose connection failed');
});







// TIE STO SE TESTIRANI VEKJE IMAAT *** NAD NIV 

// TODO: SEGA ZA SEGA NE CUVAS I COMMITS ZA REPO, MOZEBI KE E PREGOLEMO ZA VO DB





// methods

// -- Projects

// ***
const createNewProject = async (req) => {  
    
    // const creator = req.session.userName;
    const creator = 'NekojCovek';               // FIXME: radi postman
    
    const newProject = new Project({
        name: req.body.name,
        status: req.body.status,
        segments: req.body.segments,
        creator           
    });

    // debug(newProject);      


    try {
        const result = await newProject.save();

        // Go stava proektot i kaj userot vo db
        const theUser = await User.findOne({ gitUsername: creator });
        theUser.projectIds.push(result.id);

        const userObjectId = mongoose.Types.ObjectId(theUser.id);

        // eslint-disable-next-line no-unused-vars
        const resUsr = await User.findByIdAndUpdate(userObjectId, theUser, { new: true }).exec();
        // debug(resUsr);

        return result;
    } catch (error) {
        debug(error);
        return error;
    }
    
};
// ***
const editProject = async (req) => {
    const { id } = req.params;

    const newProject = {            // NOTE: ne pravis new Project() kako pri addNewProject
        creator: req.body.creator,
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
// ***          // preku ova dodavas/trgas segments, a za repos imas posebni metodi
const getAllProjects = async () => {
    const result = await Project.find().exec();
    return result;
};
// ***
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
// ***
const getProjectsOfLoggedInUser = async () => {
    
    // const username = req.session.userName;       // FIXME: Radi postman vaka
    const username = 'NekojCovek';

    const allProjs = await Project.find().exec();

    const result = allProjs.filter(pr => {
        return pr.creator === username;
    });

    return result;
};
// ***
const deleteProject = async (req) => {         // Userot moze da napravi delete samo na proekt na koj toj e kreator
    const { id } = req.params;

    // const username = req.session.userName;       // FIXME: Radi postman vaka
    const username = 'NekojCovek';
    const theUser = await User.findOne({ gitUsername: username });


    if (!theUser.projectIds.includes(id)) {
        return 'Cannot delete a project that is not created by the logged in user';
    }

    try {       // delete project id from the user
        const idxOfProjId = theUser.projectIds.indexOf(id);
        theUser.projectIds.splice(idxOfProjId, 1);

        const userObjectId = mongoose.Types.ObjectId(theUser.id);

        const result = await User.findByIdAndUpdate(userObjectId, theUser, { new: true }).exec();
        debug(result);

    } catch (error) {
        debug(error);
        return 'Cannot remove project form user';
    }

    try {
        const result = await Project.findByIdAndDelete(id).exec();
        return result;
    } catch (error) {
        debug(error);
        return `Cannot delete the project with id ${id}`;
    }
    
};
 
// -- Users
// ***
const createNewUser = async (gitUsername, gitUrl, gitAvatarUrl, projectIds, followingGitRepos) => {

    const newUser = new User({
        gitUsername,
        gitUrl,
        gitAvatarUrl,
        projectIds,
        followingGitRepos
    });

    try {
        const result = await newUser.save();
        return result;
    } catch (error) {
        debug(error);
        return error;
    }
};
// ***
const getUserById = async (req) => {
    const { id } = req.params;
    try {
        const res = await User.findById(id).exec();
        return res;
    } catch (error) {
        debug(error);
        return `Cannot find user with id: ${id}`;
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

const addNoteToRepo = async (req) => {};








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
module.exports.getProjectsOfLoggedInUser = getProjectsOfLoggedInUser;

module.exports.createNewUser = createNewUser;
module.exports.getUserById = getUserById;

module.exports.addRepoToProject = addRepoToProject;
module.exports.getRepoById = getRepoById;
module.exports.removeRepoFromProject = removeRepoFromProject;
