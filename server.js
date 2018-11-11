const express = require('express');
const app = express();
const cors = require('cors');
const { getSnagJobs } = require('./snag');
const { getIndeedJobs } = require('./indeed');
const fs = require('fs');
const sampleJobs = require('./sample-jobs.json');

//REMOVE THIS IN PRODUCTION
app.use(cors());

app.get('/api/jobs/indeed', (req, res) => {
  getIndeedJobs().then( (parsed) => {
    console.log(parsed);
    res.json(parsed);
  });
});
app.get('/api/jobs/snag', (req, res) => {
  getSnagJobs().then( (parsed) => {
    console.log(parsed);
    res.json(parsed);
  });
  // res.json(sampleJobs);
});

app.get('/api/jobs', (req, res) => {
  //TODO: combine jobs
});

app.use(express.static('public'));
app.listen(process.env.PORT || 8001);