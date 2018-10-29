const rp = require('request-promise');
const cheerio = require('cheerio');
const baseUrl = 'https://snagajob.com';
const url2 = 'https://www.snagajob.com/job-search/s-north+carolina/l-chapel+hill/w-27514?radius=0';
const url = require('url');
const queryString = require('querystring');
const _ = require('underscore');

rp(url2)
.then(html => parseSnagHTML(html))
.catch(e => console.error(e));

function parseSnagHTML(html, collection){
  const $ = cheerio.load(html);
  const jobs = $('article');
  console.log(`There are ${jobs.length} jobs listed`)
  jobs.each( (i, job) => {
    if (i === 0) {
    const uri = $(job).find('.result-title a').attr('href');
    const jobUrl = makeUrl(uri);
    collection.set({jobUrl});
    }
  });
}

function parseSnagJob(html, model){
  const $ = cheerio.load(html);
  const companyName = parseDt($, 'Company');
  const jobTitle = parseDt($, 'Job Title')
  const jobType = $('dt:contains("Job Type")').next().text().trim();
  const pay = $('dt:contains("Wages")').next().text().trim();
  const location = $('dt:contains("Location")').next().text().trim();
  const postedDate = $('.posted-date').text().trim();
  const industries = parseIndustries($);
  model.set({
    companyName, jobTitle, jobType, pay, location, postedDate, industries
  });
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

module.exports = { parseSnagHTML, parseSnagJob };

//categories
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
connections

--addl categories--
posting url
posting source
*/
