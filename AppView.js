const Backbone = require('backbone');

const AppView = Backbone.View.extend({
  events: {
    '#snag-button:click': this.model.jobs.fetchSnag()
  },
  initialize: function(){
    this.render();
    this.$snagButton = $('#snag-button');
  },
  el: '#container',
  // template: Handlebars.compile()
  render: function(){
    return this;
  }
});

module.exports = AppView;