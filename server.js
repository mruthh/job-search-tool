const express = require('express');
const app = express();
const { getJobs } = require('./all-jobs');
const fs = require('fs');
const sampleJobs = require('./sample-jobs.json');
const _ = require('underscore');
const queryString = require('querystring');
const cors = require('cors');
const { fetchIndeedJobs } = require('./fetch-indeed-jobs');
require('dotenv').config();


const defaultParams = {
  numResults: 25,
  startIndex: 0,
  city: 'chapelhill',
  radius: 10

};

if (process.env.DEV) app.use(cors());

app.get('/api/jobs', (req, res) => {

  const params = {...defaultParams, ...req.query};
  fetchIndeedJobs(params).then((jobs) => {
    //flatten results into single-level array
    const flattened = _.flatten(jobs);
    //keep only unique results
    const uniq = _.uniq(flattened, false, (result) => {return result.jobUrl});
    res.json(uniq);
  })
  .catch((e) => {
    res.status(500).send(e);
  });
});

app.use(express.static('./react-client/build'));
app.listen(process.env.PORT || 8001);