const rp = require('request-promise');
const cheerio = require('cheerio');
const url2 = 'https://www.indeed.com/jobs?l=Chapel+Hill,+NC&radius=0&explvl=entry_level&sort=date';
const url = require('url');
const queryString = require('querystring');
const _ = require('underscore');

function getIndeedJobs() {
  return rp(url2)
  .then(html => parseIndeedHTML(html))
  .catch(e => console.error(e));
}


function parseIndeedHTML(html){
  const $ = cheerio.load(html);
  const jobs = $('[data-tn-component="organicJob"]');
  console.log(`There are ${jobs.length} jobs listed`)
  const parsedJobs = [];
  jobs.each( (i, job) => {
      const uri = $(job).find('a').attr('href');
      const jobUrl = makeUrl(uri);
      const promise = rp(jobUrl)
        .then(html => parseIndeedJob(html, jobUrl))
        .catch(e => console.log(e));
      parsedJobs.push(promise);
  });
  return Promise.all(parsedJobs);
}

function parseIndeedJob(html, jobUrl){
  const $ = cheerio.load(html);
  const companyName = getCompanyName($);
  const jobTitle = $('h3').text().trim();
  const jobType = getType($);
  const pay = getPay($);
  const location = getLocation($);
  const postedDate = getPostedDate($);
  const industries = getIndustries($);
  const parsed = {
    companyName, jobTitle, jobType, pay, location, postedDate, industries, jobUrl
  }
  return parsed;
}

function makeUrl(uri){
  const query = url.parse(uri).query;
  const postingId = queryString.parse(query).jk;
  return postingId ? `https://www.indeed.com/viewjob?jk=${postingId}` : null;
}

function getCompanyName($){
  const footer = $('.jobsearch-JobMetadataFooter').text().split('-');
  return footer[0];
}

function getType($){
  //todo: write best-guess for full time or part time
  return 'Unknown';
}

function getPay($){
  return 'Unknown;'
}

function getLocation($){
  return 'Unknown;'
}

function getPostedDate($){
  const footer = $('.jobsearch-JobMetadataFooter').text().split(' ');
  // posting date is expressed as x hours ago or x days ago. 
  // Find 'ago' and work backwards
  const agoIndex = footer.indexOf('ago');
  const [num, units, ago] = footer.slice(agoIndex - 2, agoIndex + 1);
  return `${num} ${units} ${ago}`;
  //TODO: translate both indeed and snag dates into consistent format
  
}

function getIndustries($){
  return 'Unknown;'
}

module.exports = { getIndeedJobs, parseIndeedHTML };