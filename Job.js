const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jobsDB');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  companyName: String, 
  jobTitle: String, 
  jobType: String, 
  pay: String, 
  location: String, 
  postedDate: String, 
  industries: String, 
  jobUrl: String
});

const Job = mongoose.model('Job', jobSchema);