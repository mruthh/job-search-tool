const Backbone = require('backbone');
const JobModel = require('./JobModel');

const _ = require('underscore');


const JobsCollection = Backbone.Collection.extend({
  url: '/api/jobs/snag',
  model: JobModel,
});

module.exports = JobsCollection;