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
  parse: function(data){

  },
  fetchSnag: function(){
    rp(url2)
      .then(html => parseSnagHTML(html, collection))
      .catch(e => console.error(e));
  },
  // parseSnagHTML: function(html){
  //   const $ = cheerio.load(html);
  //   const jobs = $('article');
  //   console.log(`There are ${jobs.length} jobs listed`)
  //   jobs.each( (i, job) => {
  //     if (i === 0) {
  //     const uri = $(job).find('.result-title a').attr('href');
  //     const jobUrl = this.makeUrlFromHref(uri);
  //     this.set({jobUrl});
  //     };
  //   });
    
  // },
  // makeUrlFromHref(uri){
  //   const query = url.parse(uri).query;
  //   const postingId = queryString.parse(query).postingid;
  //   return `https://www.snagajob.com/job-seeker/jobs/job-details.aspx?postingid=${postingId}`;
  // }
});

module.exports = JobsCollection;