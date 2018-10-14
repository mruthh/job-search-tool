const rp = require('request-promise');
const cheerio = require('cheerio');
const baseUrl = 'https://snagajob.com';
const url2 = 'https://www.snagajob.com/job-search/s-north+carolina/l-chapel+hill/w-27514?radius=0';
const url = require('url');
const queryString = require('querystring');
const _ = require('underscore');

rp(url2)
.then(html => parseSnagCollection(html))
.catch(e => console.error(e));

function parseSnagCollection(html){
  const $ = cheerio.load(html);
  const jobs = $('article');
  console.log(`There are ${jobs.length} jobs listed`)
  jobs.each( (i, job) => {
    if (i === 0) {
    const uri = $(job).find('.result-title a').attr('href');
    const jobUrl = makeUrl(uri);
    rp(jobUrl)
    .then(html => parseSnagJob(html))
    .catch(e => console.log(e));
    }
  });
}

function parseSnagJob(html){
  const $ = cheerio.load(html);
  // const companyName = $('dt:contains("Company")').next().text().trim();
  const companyName = parseDt($, 'Company');
  // const jobTitle = $('dt:contains("Job Title")').next().text().trim();
  const jobTitle = parseDt($, 'Job Title')
  const jobType = $('dt:contains("Job Type")').next().text().trim();
  const pay = $('dt:contains("Wages")').next().text().trim();
  const location = $('dt:contains("Location")').next().text().trim();
  const postedDate = $('.posted-date').text().trim();
  const industries = parseIndustries($);
  const parsed = {
    companyName, jobTitle, jobType, pay, location, postedDate, industries
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
//CEF categories
/*
xFT/PT
xTitle
xCompany
xLocation
xIndustry 
xSalary
Requirements
Deadline
xDate Posted
CEF connections

--addl categories--
posting url
posting source
*/
