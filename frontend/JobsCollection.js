const Backbone = require('backbone');
const JobModel = require('./JobModel');

const _ = require('underscore');


const JobsCollection = Backbone.Collection.extend({
  url: '/api/jobs/snag',
  model: JobModel,
  initialize: function(){
    console.log('initializing jobs collection')
    this.fetch();
  }
});

module.exports = JobsCollection;