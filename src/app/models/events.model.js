import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let EvnetSchema = new Schema({
    name: { type: String, required: true, max: 100 },
    seats: { type: Number, required: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model('Event', EvnetSchema);