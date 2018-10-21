const Backbone = require('backbone');
const JobModel = require('./JobModel');

const JobsCollection = Backbone.Collection.extend({
  url: null,
  model: JobModel,
  parse: function(data){

  }
});

module.exports = JobsCollection;