const express = require('express');
const app = express();
const { getJobs } = require('./snag');

app.get('/snag', (req, res) => {
  getJobs().then( (parsed) => {
    console.log(parsed);
    res.json(parsed);
  });
})
app.use(express.static('public'));
app.listen(process.env.PORT || 8000);