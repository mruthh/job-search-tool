const rp = require('request-promise');
const cheerio = require('cheerio');
const url2 = 'https://www.snagajob.com/job-search/s-north+carolina/l-chapel+hill/w-27514?radius=0';
const url = require('url');
const queryString = require('querystring');
const _ = require('underscore');
const moment = require('moment');

function buildSnagUrl(params){
  let cityString;
  if (params.city === 'chapelhill') cityString = 'l-chapel+hill';
  else cityString = `w-${params.city}`;
  const url = `https://www.snagajob.com/job-search/s-north+carolina/${cityString}?radius=${params.radius}&sort=date`;
  console.log(`Getting jobs from ${url}`);
  return url;
}
function parseSnagHTML(html){
  const $ = cheerio.load(html);
  const jobs = $('job-overview');
  console.log(`There are ${jobs.length} jobs listed`)
  const parsedJobs = [];
  jobs.each( (i, job) => {
      // const uri = $(job).find('.result-title a').attr('href'); <-- before redesign
      const urlElem = $(job).find('[itemprop="url"]');
      const jobUrl = urlElem.attr('content');
      // const jobUrl = makeUrl(uri);
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
  const companyName = getCompanyName($);
  const jobTitle = getJobTitle($);
  const jobType = getJobType($);
  const pay = $('dt:contains("Wages")').next().text().trim();
  const location = parseLocation($);
  const postedDate = parsePostedDate($);
  const industries = parseIndustries($);
  const requirements = '';
  const cefConnections = '';
  const parsed = {
    companyName, jobTitle, jobType, pay, location, postedDate, industries, jobUrl, requirements, cefConnections
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

function parsePostedDate($){
  const dateString = $('.posted-date').text().trim().replace('Posted: ', '');
  const date = moment(dateString);
  return date.isValid() ? date.format('MM-DD-YY') : dateString;
}
function parseDt($, label){
  return $(`dt:contains("${label}")`).next().text().trim();
}

function getCompanyName($){
  return $('.job-company').text();
}

function getJobTitle($){
  return $('.job-position').text();
}

function getJobType($){
  //as of March 2019, full-time/part-time status is listed next to clock icon
  const rawText = $('.icon-time').next().getText();
  if (rawText.includes('Full-time') && rawText.includes('Part-time')) {
    return 'FT/PT';
  }
  if (rawText.includes('Full-time')) return 'FT';
  if (rawText.includes('Part-time')) return 'PT';
  return '';
}

function parseLocation($){
  const rawLocation = $('dt:contains("Location")').next().html().split('<br>');
  //cheerio will ignore <br> tags. manually replace them with newlines
  return rawLocation.map( (ln) => {
    return cheerio.load(ln).text();
  }).join('\n');
}

module.exports = { parseSnagHTML, buildSnagUrl };