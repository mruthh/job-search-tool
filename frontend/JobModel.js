const Backbone = require('backbone');

const _ = require('underscore');


const JobModel = Backbone.Model.extend({
  defaults: {
    companyName: '', 
    jobTitle: '', 
    jobType: '', 
    pay: '', 
    location: '', 
    postedDate: '', 
    industries: '',
    jobUrl: ''
  },

});

module.exports = JobModel;