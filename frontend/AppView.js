const Backbone = require('backbone');
const JobsCollection = require('./JobsCollection');
const $ = require('jquery');

const AppView = Backbone.View.extend({
  events: {
    '#snag-button:click': () => {
      console.log('clicked snag button')
      this.model.set('jobs', new JobsCollection())
    }
  },
  initialize: function(){
    this.$snagButton = $('#snag-button');
    this.$jobsContainer = $('#jobs-container');
    // this.listenTo(this.model, 'jobs:add', () => {
    //   const jobView = new JobView({ model: job});
    //   this.$thumbnails.append(jobView.render().el);
    // });
    this.render();
  },
  el: '#container',
  render: function(){
    console.log('rendering app view')
    return this;
  },
  renderJob: function(){
    this.$el.append(this.template(this.model.attributes));
    return this;
  }
});

module.exports = AppView;