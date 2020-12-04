const mongoose = require('mongoose');
const debug = require('debug')('app:project');
const ProjectSegment = require('./projectSegment');         // NOTE: Vaka pravis req na MODEL a ne na SCHEMA. 
                                                            // Zatoa vo modelot imas .schema:


const { Schema } = mongoose;

const ProjectSchema = new Schema({
    creator: { type: String, required: true, unique: false },
    name: { type: String, required: true },
    status: {                                               // NOTE: Vaka se definira enum
        type: [{ type: String, enum: ['development', 'inactive', 'finished'] }],     
        default: 'development'
    },
    segments: [ProjectSegment.schema]
});

// NOTE: Vaka se dodavaat DDD metodi na klasata
ProjectSchema.methods.printNameExample = () => {
    debug(`Ich bin ein ${this.name}`);
}; 

module.exports = mongoose.model('Project', ProjectSchema); 
