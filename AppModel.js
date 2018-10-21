const Backbone = require('backbone');
const JobsCollection = require('./JobsCollection');

const AppModel = Backbone.Model.extend({
  defaults: {
    jobs: new JobsCollection()
  }
});

module.exports = AppModel;