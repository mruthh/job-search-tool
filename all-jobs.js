const rp = require('request-promise');
const cheerio = require('cheerio');
const snagUrl = 'https://www.snagajob.com/job-search/s-north+carolina/l-chapel+hill/w-27514?radius=0';
const indeedUrl = 'https://www.indeed.com/jobs?l=Chapel+Hill,+NC&radius=0&explvl=entry_level&sort=date';
const url = require('url');
const queryString = require('querystring');
const _ = require('underscore');
const { parseSnagHTML } = require('./snag');
const { parseIndeedHTML } = require('./indeed');


/*
 * Relevant params: 
  sort=date
  to get a page, just page-[1-based pageNum] 
 */

function getJobs(params) {
  //jobs come in sets of 15, minus ads. translate results to number of pages
  
  const numPages = {
    snag: Math.ceil(params.maxResults/15),
    indeed: Math.ceil(params.maxResults/10)
  };
  const requests = [];

  //fetch from snagajob
  if (!params.excludeSnag) {
    for (let i = 0; i < numPages.snag; i++) {
      const baseUrl = snagUrl;
      //to get a page, add page-[1-based pageNum] to url
      const page = `&page=${i + 1}`
      const request = rp(`${baseUrl}${page}`)
      .then(html => parseSnagHTML(html))
      requests.push(request);
    }
  }
  //fetch from indeed
  if (!params.excludeIndeed){
    for (let i = 0; i < numPages.indeed; i++) {
      const baseUrl = indeedUrl;
      //to get a page, add start index to url
      const start = `&start=${i * 10}`
      const request = rp(`${baseUrl}${start}`)
      .then(html => parseIndeedHTML(html))
      requests.push(request);
    }
  }

  return Promise.all(requests)
  .catch(e => console.error(e));
}


module.exports = { getJobs };