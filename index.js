const rp = require('request-promise');
const cheerio = require('cheerio');
const baseUrl = 'https://snagajob.com';
const url2 = 'https://www.snagajob.com/job-search/s-north+carolina/l-chapel+hill/w-27514?radius=5';
const url = require('url');
const queryString = require('querystring');

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
  const companyName = $('dt:contains("Company")').next().text().trim();
  const jobTitle = $('dt:contains("Job Title")').next().text().trim();
  const jobType = $('dt:contains("Job Type")').next().text().trim();
  const pay = $('dt:contains("Wages")').next().text().trim();
  const location = $('dt:contains("Location")').next().text().trim();
  const postedDate = $('.posted-date').text().trim();
  //this one's more complicated - it might be a list. But currently find is not working. Ugh.
  const industry = $('h3:contains("Job Industries")').find('a')

  const parsed = {
    companyName, jobTitle, jobType, pay, location, postedDate, industry
  }
  return parsed;
}

function makeUrl(uri){
  const query = url.parse(uri).query;
  const postingId = queryString.parse(query).postingid;
  return `https://www.snagajob.com/job-seeker/jobs/job-details.aspx?postingid=${postingId}`;
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
