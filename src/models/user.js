const mongoose = require('mongoose');
// const Project = require('./project');
const GitRepo = require('./gitRepo');

const { Schema } = mongoose;


// NOTE: My gitRepos ne se zacuvuvaat vo baza, tuku po potreba se dobivaat od apito so tokenot
// NOTE: Moze userot koj e owner na proektot da dodade drug user na proektot

const UserSchema = new Schema({
    gitUsername: { type: String, required: true, unique: true },
    gitUrl: { type: String, required: true },
    gitAvatarUrl: { type: String, required: true },
    projectIds: { type: [String], default: [] },
    followingGitRepos: { type: [GitRepo.schema], default: [] }

});


module.exports = mongoose.model('User', UserSchema);
