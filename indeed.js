const rp = require('request-promise');
const cheerio = require('cheerio');
const url2 = 'https://www.indeed.com/jobs?l=Chapel+Hill,+NC&radius=0&explvl=entry_level&sort=date';
const url = require('url');
const queryString = require('querystring');
const _ = require('underscore');
const moment = require('moment');



function parseIndeedHTML(html){
  const $ = cheerio.load(html);
  const jobs = $('[data-tn-component="organicJob"]');
  console.log(`There are ${jobs.length} jobs listed`)
  const parsedJobs = [];
  jobs.each( (i, job) => {
      const uri = $(job).find('a').attr('href');
      const jobUrl = makeUrl(uri);
      if (makeUrl(uri)) {
        const promise = rp(jobUrl)
          .then(html => parseIndeedJob(html, jobUrl))
          .catch(e => console.log(e));
        parsedJobs.push(promise);
      }
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
  const requirements = '';
  const cefConnections = '';
  const parsed = {
    companyName, jobTitle, jobType, pay, location, postedDate, industries, jobUrl, requirements, cefConnections
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
  //helper to find keywords in ad
  const hasKey = (keys, text) => {
    let hasKey = false;
    for (let key of keys){
      if (text.match(key)){
        hasKey = true;
        break;
      }
    }
    return hasKey;
  }

  const postingText = $.text().toLowerCase();
  const ptKeys = [/part-time/, /part time/, /(\0|\W)pt(\0|\W)/, /parttime/];
  const ftKeys = [/full-time/, /full time/, /(\0|\W)ft(\0|\W)/, /fulltime/];
  const hasPtKey = hasKey(ptKeys, postingText);
  const hasFtKey = hasKey(ftKeys, postingText);

  if (hasPtKey && hasFtKey) return 'PT/FT';
  if (hasPtKey) return 'PT';
  if (hasFtKey) return 'FT';
  return '';
}

function getPay($){
  //if there's a span with a dollar sign, it probably contains pay info
  const moneySpans = $('span').filter( (i, el) => {
    return $(el).text().includes('$');
  }).map( (i, el) => {
    return $(el).text();
  }).toArray();

  if (moneySpans.length) return moneySpans.join('\n');
  return '';
}

function getLocation($){
  return '';
}

function getPostedDate($){
  const footer = $('.jobsearch-JobMetadataFooter').text().split(' ');
  // posting date is expressed as x hours ago or x days ago. 
  // Find 'ago' and work backwards
  const agoIndex = footer.indexOf('ago');
  const [num, units, ago] = footer.slice(agoIndex - 2, agoIndex + 1);
  const agoString = `${num} ${units} ${ago}`;
  //we're translating to a day.
  //if units are hours, use today's date
  let date = moment();
  //if units are days months, moment subtract num units
  if (units !== 'hours') date = moment().subtract(parseInt(num), units);
  return date.format('MM-DD-YY');
}

function getIndustries($){
  return '';
}

module.exports = { parseIndeedHTML };