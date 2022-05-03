//instance of the collection class
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const testSchema = new Schema({
    patientName: {type: String, required: [true, 'Full name is required']},
    title: {type: String, required: [true, 'title is required']},
    patientID: {type: Schema.Types.ObjectId, ref: 'User'},
    catagory: {type: String, required: true},
    endTime: {type: String, required: [true, 'Time is required']},
    concerns: {type: String, required: [true, 'concerns are required for your safety, put none if no concerns'],
        minlength: [4, 'concerns should have at least 4 characters']},
    date: {type: Date, required: [true, 'Date is required']},
    startTime: {type: String, required: [true, 'Time is required']},
    endTime: {type: String, required: [true, 'Time is required']},
    imgSrc: {type: String }

},
{timestamps: true}
);

module.exports = mongoose.model('Test', testSchema);
