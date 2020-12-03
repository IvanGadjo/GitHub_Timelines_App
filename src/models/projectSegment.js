const mongoose = require('mongoose');
const GitRepo = require('./gitRepo');

const { Schema } = mongoose;

const ProjectSegmentSchema = new Schema({
    name: { type: String, unique: false },
    gitRepos: { type: [GitRepo.schema], default: [] }
});

module.exports = mongoose.model('ProjectSegment', ProjectSegmentSchema);
