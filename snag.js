const rp = require('request-promise');
const cheerio = require('cheerio');
const url2 = 'https://www.snagajob.com/job-search/s-north+carolina/l-chapel+hill/w-27514?radius=0';
const url = require('url');
const queryString = require('querystring');
const _ = require('underscore');

/*
 * Relevant params: 
  sort=date
  to get a page, just page-[1-based pageNum] 
 */

function getSnagJobs(maxResults) {
  //jobs come in sets of 15, minus ads. translate results to number of pages

  const numPages = Math.ceil(maxResults/15);

  const requests = [];
  for (let i = 0; i < numPages; i++) {
    const baseUrl = url2;
    //to get a page, add page-[1-based pageNum] to url
    const page = `&page=${i + 1}`
    const request = rp(`${baseUrl}${page}`)
    .then(html => parseSnagHTML(html))
    requests.push(request);
  }

  return Promise.all(requests)
  .catch(e => console.error(e));
}


function parseSnagHTML(html){
  const $ = cheerio.load(html);
  const jobs = $('article');
  console.log(`There are ${jobs.length} jobs listed`)
  const parsedJobs = [];
  jobs.each( (i, job) => {
      const uri = $(job).find('.result-title a').attr('href');
      const jobUrl = makeUrl(uri);
      const promise = rp(jobUrl)
        .then(html => parseSnagJob(html, jobUrl))
        .catch(e => console.log(e));
      parsedJobs.push(promise);
  });
  return Promise.all(parsedJobs);
}

function parseSnagJob(html, jobUrl){
  console.log('parsing a job')
  const $ = cheerio.load(html);
  const companyName = parseDt($, 'Company');
  const jobTitle = parseDt($, 'Job Title')
  const jobType = $('dt:contains("Job Type")').next().text().trim();
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
  const postingId = queryString.parse(query).postingid;
  return `https://www.snagajob.com/job-seeker/jobs/job-details.aspx?postingid=${postingId}`;
}

function parseIndustries($){
  const industries = $('#sajCpIndustries').find('li')
    .map((i, li) => $(li).text()).toArray()
  return _.uniq(industries).join(', ');
}

function parseDt($, label){
  return $(`dt:contains("${label}")`).next().text().trim();
}

module.exports = { getSnagJobs, parseSnagHTML };