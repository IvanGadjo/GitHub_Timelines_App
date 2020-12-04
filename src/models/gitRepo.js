const mongoose = require('mongoose');

const { Schema } = mongoose;



const CommitSchema = new Schema({
    commitId: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, required: true },
    url: { type: String, required: true },
    commitMessage: { type: String, default: '', unique: false }
});

const GitRepoSchema = new Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    numCommits: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    htmlUrl: { type: String, required: true },
    size: { type: Number, required: true },
    description: { type: String, required: false },
    notes: { type: [String], default: [], required: false },
    commits: [CommitSchema]             // array of commits
});

module.exports = mongoose.model('GitRepo', GitRepoSchema);








