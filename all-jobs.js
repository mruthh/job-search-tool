const rp = require('request-promise');
const snagUrl = 'https://www.snagajob.com/job-search/s-north+carolina/l-chapel+hill/w-27514?sort=date&radius=10';
const indeedUrl = 'https://www.indeed.com/jobs?l=Chapel+Hill,+NC&radius=10&explvl=entry_level&sort=date';
const _ = require('underscore');
const { parseSnagHTML, buildSnagUrl } = require('./snag');
const { parseIndeedHTML, buildIndeedUrl } = require('./indeed');

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
    baseUrl: buildIndeedUrl(params),
    pageParser: parseIndeedHTML,
  };
  
  const snag = {
    multiplier: 15,
    baseUrl: buildSnagUrl(params),
    pageParser: parseSnagHTML,
  };

  //every time the req start index goes up by 25, the starting page should go up by 1
  const startNum = Math.ceil(params.startIndex/25);

  const snagRequests = makeRequests(snag, startNum, numPages);
  const indeedRequests = makeRequests(indeed, startNum, numPages);

  const requests = [...snagRequests, ...indeedRequests];
  return Promise.all(requests)
  .catch(e => console.error(e));
}


module.exports = { getJobs };