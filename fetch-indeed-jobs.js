const rp = require('request-promise');
const _ = require('underscore');
const { parseIndeedHTML, buildIndeedUrl } = require('./indeed');

/*
 * Relevant params: 
  sort=date
  to get a page, just page-[1-based pageNum] 
 */

//helper function. makes requests for each job site
function fetchIndeedJobs(params){
  // startNum, numPages
  const requests = [];
  for (let i = 0; i < 2; i++) {
    const request = rp({
      url: buildIndeedUrl(params),
      qs: {
        limit: 50, 
        start: (params.startPage) * 50,
      }
    })
    .then(html => parseIndeedHTML(html))
    requests.push(request);
  }
  return Promise.all(requests);
}


// function fetchIndeedJobs(params) {
//   // SUMMER 2019: WE ARE *ALWAYS* GOING TO FETCH 100 PAGES AT ONCE. ONLY QUESTION IS WHERE WE'RE STARTING

//   //for each 25 results, add one page of results from each site
//   // ^^ NOPE, JUST ALWAYS FETCH 2
//   const numPages = 2;
  
//   //every time the req start index goes up by 1, the starting page should go up by 50

//   const indeedRequests = makeRequests(startIndex, numPages);
//   return Promise.all(indeedRequests)
//   .catch(e => console.error(e));
// }

module.exports = { fetchIndeedJobs };