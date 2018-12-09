const express = require('express');
const app = express();
const { getSnagJobs } = require('./snag');
const { getIndeedJobs } = require('./indeed');
const { getJobs } = require('./all-jobs');
const fs = require('fs');
const sampleJobs = require('./sample-jobs.json');
const _ = require('underscore');
const queryString = require('querystring');
const cors = require('cors');

const logger = require('./logger');

require('dotenv').load();



const defaultParams = {
  numResults: 25,
  startIndex: 0,
};

if (process.env.DEV) app.use(cors());

app.get('/api/jobs', (req, res) => {
  const params = {...defaultParams, ...req.query};
  logger.info({defaultParams});
  logger.info({queryParams: req.query});
  logger.info({combinedParams: params});
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