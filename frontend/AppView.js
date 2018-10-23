const Backbone = require('backbone');
const JobsCollection = require('./JobsCollection');
const $ = require('jquery');

const AppView = Backbone.View.extend({
  events: {
    '#snag-button:click': () => {this.model.set('jobs', new JobsCollection())}
  },
  initialize: function(){
    console.log(this.model.attributes);
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