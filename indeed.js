const rp = require('request-promise');
const cheerio = require('cheerio');
const url2 = 'https://www.indeed.com/jobs?l=Chapel+Hill,+NC&radius=0&explvl=entry_level&sort=date';
const url = require('url');
const queryString = require('querystring');
const _ = require('underscore');

function getJobs() {
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
  const companyName = $('.jobsearch-CompanyAvatar-companyLink').text().trim();
  const jobTitle = $('.jobsearch-JobInfoHeader').text().trim();
  const jobType = getType($);
  const pay = $('dt:contains("Wages")').next().text().trim();
  const location = $('dt:contains("Location")').next().text().trim();
  const postedDate = $('.posted-date').text().trim();
  const industries = parseIndustries($);
  const parsed = {
    companyName, jobTitle, jobType, pay, location, postedDate, industries, jobUrl
  }
  return parsed;
}

function makeUrl(uri){
  const query = url.parse(uri).query;
  console.log(query)
  const postingId = queryString.parse(query).jk;
  return `https://www.indeed.com/viewjob?jk=${postingId}`;
}

function parseIndustries($){
  const industries = $('#sajCpIndustries').find('li')
    .map((i, li) => $(li).text()).toArray()
  return _.uniq(industries).join(', ');
}

function parseDt($, label){
  return $(`dt:contains("${label}")`).next().text().trim();
}

function getType($){
  //todo: write best-guess for full time or part time
  return 'Unknown';
}
getJobs();

module.exports = { getJobs };