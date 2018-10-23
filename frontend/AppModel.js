const Backbone = require('backbone');

const AppModel = Backbone.Model.extend({
  defaults: {
    jobs: {}
  }
});

module.exports = AppModel;