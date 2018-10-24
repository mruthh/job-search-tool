const Backbone = require('backbone');
const JobModel = require('./JobModel');

const rp = require('request-promise');
const cheerio = require('cheerio');
const baseUrl = 'https://snagajob.com';
const url2 = 'https://www.snagajob.com/job-search/s-north+carolina/l-chapel+hill/w-27514?radius=0';
const url = require('url');
const queryString = require('querystring');
const _ = require('underscore');
const { parseSnagHTML } = require('./scraper');

const JobsCollection = Backbone.Collection.extend({
  url: null,
  model: JobModel,
  initialize: function(){
    this.fetchSnag();
  },
  fetchSnag: () => {
    console.log('fetching');
    console.log(rp);
    rp(url2)
      .then(html => parseSnagHTML(html, this))
      .catch(e => console.error(e));
  },
});

module.exports = JobsCollection;