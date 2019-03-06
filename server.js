const express = require('express');
const app = express();
const { getJobs } = require('./all-jobs');
const fs = require('fs');
const sampleJobs = require('./sample-jobs.json');
const _ = require('underscore');
const queryString = require('querystring');
const cors = require('cors');
require('dotenv').config();


const defaultParams = {
  numResults: 25,
  startIndex: 0,
  city: 'chapelhill',
  radius: 10

};

if (process.env.DEV) app.use(cors());

app.get('/api/jobs', (req, res) => {
  if (req.query.hasOwnProperty('city')) {
    if (req.query.city !== 'chapelhill' && req.query.city !== 'durham') {
      return res.send(400, 'City can only be set to chapelhill or durham.');
    }
  }
  const params = {...defaultParams, ...req.query};
  getJobs(params).then((jobs) => {
    //flatten results into single-level array
    const flattened = _.flatten(jobs);
    //keep only unique results
    const uniq = _.uniq(flattened, false, (result) => {return result.jobUrl});
    console.log(flattened.length);
    console.log(uniq.length);
    res.json(uniq);
  });
});

app.use(express.static('./react-client/build'));
app.listen(process.env.PORT || 8001);