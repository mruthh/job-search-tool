const rp = require('request-promise');
const cheerio = require('cheerio');
const snagUrl = 'https://www.snagajob.com/job-search/s-north+carolina/l-chapel+hill/w-27514?radius=0';
const indeedUrl = 'https://www.indeed.com/jobs?l=Chapel+Hill,+NC&radius=0&explvl=entry_level&sort=date';
const url = require('url');
const queryString = require('querystring');
const _ = require('underscore');
const { parseSnagHTML } = require('./snag');
const { parseIndeedHTML } = require('./indeed');
const logger = require('./logger');

/*
 * Relevant params: 
  sort=date
  to get a page, just page-[1-based pageNum] 
 */

//helper function. makes requests for each job site
function makeRequests(site, startNum, numPages){
  const requests = [];
  for (let i = 0; i < numPages; i++) {
    const request = rp({
      url: site.baseUrl,
      qs: { start: (startNum + i) * site.multiplier }
    })
    .then(html => site.pageParser(html))
    requests.push(request);
  }
  return requests;
}


function getJobs(params) {
  
  const indeed = {
    multiplier: 10,
    baseUrl: indeedUrl,
    pageParser: parseIndeedHTML,
  };
  
  const snag = {
    multiplier: 15,
    baseUrl: snagUrl,
    pageParser: parseSnagHTML,
  };

  //for each 25 results, add one page of results from each site
  const numPages = Math.ceil(params.numResults/25);
  
  //every time the req start index goes up by 25, the starting page should go up by 1
  const startNum = Math.ceil(params.startIndex/25);

  const snagRequests = makeRequests(snag, startNum, numPages);
  const indeedRequests = makeRequests(indeed, startNum, numPages);

  const requests = [...snagRequests, ...indeedRequests];
  return Promise.all(requests)
  .catch(e => console.error(e));
}


module.exports = { getJobs };