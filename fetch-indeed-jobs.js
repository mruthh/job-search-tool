const rp = require('request-promise');
const _ = require('underscore');
const { parseIndeedHTML, buildIndeedUrl } = require('./indeed');


//helper function. makes requests for each job site
function fetchIndeedJobs(params){
  // SUMMER 2019: WE ARE *ALWAYS* GOING TO FETCH 100 JOBS (2 PAGES) AT ONCE. ONLY QUESTION IS WHERE WE'RE STARTING
  const numPages = 2
  const requests = [];
  // page 2 = 2nd and 3rd set of 50 results
  const startIndex = params.startIndex * 2; 
  for (let i = 0; i < numPages; i++) {
    const request = rp({
      url: buildIndeedUrl(params),
      qs: {
        limit: 50, 
        start: (startIndex + i) * 50,
      }
    })
    .then(html => parseIndeedHTML(html))
    requests.push(request);
  }
  return Promise.all(requests);
}

module.exports = { fetchIndeedJobs };