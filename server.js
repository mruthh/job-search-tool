const express = require('express');
const app = express();
const cors = require('cors');
const { getSnagJobs } = require('./snag');
const { getIndeedJobs } = require('./indeed');
const { getJobs } = require('./all-jobs');
const fs = require('fs');
const sampleJobs = require('./sample-jobs.json');
const _ = require('underscore');
const queryString = require('querystring');

//REMOVE THIS IN PRODUCTION
app.use(cors());

const defaultParams = {
  maxResults: 10
};

app.get('/api/jobs/indeed', (req, res) => {
  getIndeedJobs().then( (parsed) => {
    console.log(parsed);
    res.json(parsed);
  });
});
app.get('/api/jobs/snag', (req, res) => {
  console.log(req);
  let numJobs = req.query.numJobs ? req.query.numJobs : 15;
  getSnagJobs(numJobs).then( (parsed) => {
    const flattened = _.flatten(parsed);
    console.log(flattened.length);
    res.json(flattened);
  });
  // res.json(sampleJobs);
});

app.get('/api/jobs', (req, res) => {

  const params = {...defaultParams, ...req.params};
  getJobs(params).then((jobs) => {
    const flattened = _.flatten(jobs);
    console.log(flattened.length);
    res.json(flattened);
  });
});

app.use(express.static('public'));
app.listen(process.env.PORT || 8001);