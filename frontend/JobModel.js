const Backbone = require('backbone');
const rp = require('request-promise');
const cheerio = require('cheerio');
const url = require('url');
const queryString = require('querystring');
const _ = require('underscore');
const { parseSnagJob } = require('./scraper');

const JobModel = Backbone.Model.extend({
  defaults: {
    companyName: '', 
    jobTitle: '', 
    jobType: '', 
    pay: '', 
    location: '', 
    postedDate: '', 
    industries: '',
    jobUrl: ''
  },
  initialize: function(){
    this.on('change:jobUrl', () => {
      rp(jobUrl)
        .then(html => parseSnagJob(html))
        .catch(e => console.log(e));
    })
  }
});

module.exports = JobModel;