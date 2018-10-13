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
  const title = $('h1').text();
  console.log(title);
}

function makeUrl(uri){
  const query = url.parse(uri).query;
  const postingId = queryString.parse(query).postingid;
  return `https://www.snagajob.com/job-seeker/jobs/job-details.aspx?postingid=${postingId}`;
}