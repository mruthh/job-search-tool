const express = require('express');
const app = express();
const { getSnagJobs } = require('./snag');
const { getIndeedJobs } = require('./indeed');

app.get('/jobs/indeed', (req, res) => {
  getIndeedJobs().then( (parsed) => {
    console.log(parsed);
    res.json(parsed);
  });
});
app.get('/jobs/snag', (req, res) => {
  getSnagJobs().then( (parsed) => {
    console.log(parsed);
    res.json(parsed);
  });
});

app.get('./jobs', (req, res) => {
  //TODO: combine jobs
});

app.use(express.static('public'));
app.listen(process.env.PORT || 8000);