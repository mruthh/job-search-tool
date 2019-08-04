const rp = require('request-promise');
const _ = require('underscore');
const { parseIndeedHTML, buildIndeedUrl } = require('./indeed');


//helper function. makes requests for each job site
function fetchIndeedJobs(params){
  // SUMMER 2019: WE ARE *ALWAYS* GOING TO FETCH 100 JOBS (2 PAGES) AT ONCE. ONLY QUESTION IS WHERE WE'RE STARTING
  const numPages = 2
  const requests = [];
  for (let i = 0; i < numPages; i++) {
    const request = rp({
      url: buildIndeedUrl(params),
      qs: {
        limit: 50, 
        start: (params.startIndex) * 50,
      }
    })
    .then(html => parseIndeedHTML(html))
    .catch(e => console.log(e));
    requests.push(request);
  }
  return Promise.all(requests);
}

module.exports = { fetchIndeedJobs };